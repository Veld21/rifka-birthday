import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { CONFIG } from "./config";
let db = null;
let app = null;

// Initialize Firebase
try {
  app = initializeApp(CONFIG.firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("[Analytics] Firebase init failed:", err.message);
}

// ─── Visitor ID ──────────────────────────────────────
function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem("rw_visitor_id");
    if (!id) {
      id = "rw_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem("rw_visitor_id", id);
    }
    return id;
  } catch {
    return "rw_anon_" + Math.random().toString(36).substr(2, 6);
  }
}

function isReturningVisitor() {
  try {
    return !!localStorage.getItem("rw_visited_before");
  } catch {
    return false;
  }
}

function markVisited() {
  try {
    localStorage.setItem("rw_visited_before", "true");
  } catch {}
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isIPhone = /iPhone/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
  const device = isIPhone ? "iPhone" : isMobile ? "Mobile" : "Desktop";
  const browser = isSafari ? "Safari" : /Chrome/i.test(ua) ? "Chrome" : /Firefox/i.test(ua) ? "Firefox" : "Other";
  return { device, browser, userAgent: ua };
}

// ─── Session tracking ────────────────────────────────
let sessionDocId = null;
const sessionStart = Date.now();

export async function trackVisit() {
  if (!db) return;
  try {
    const visitorId = getOrCreateVisitorId();
    const returning = isReturningVisitor();
    const { device, browser, userAgent } = getDeviceInfo();

    const docRef = await addDoc(collection(db, "visits"), {
      visitorId,
      returning,
      device,
      browser,
      userAgent,
      sessionStart: serverTimestamp(),
      sessionEnd: null,
      totalDuration: null,
      lastPageVisited: null,
    });
    sessionDocId = docRef.id;
    markVisited();
  } catch (err) {
    console.warn("[Analytics] trackVisit failed:", err.message);
  }
}

export async function trackSessionEnd(lastPage) {
  if (!db || !sessionDocId) return;
  try {
    const duration = Math.round((Date.now() - sessionStart) / 1000);
    await updateDoc(doc(db, "visits", sessionDocId), {
      sessionEnd: serverTimestamp(),
      totalDuration: duration,
      lastPageVisited: lastPage,
    });
  } catch (err) {
    console.warn("[Analytics] trackSessionEnd failed:", err.message);
  }
}

// ─── Access question tracking ────────────────────────
export async function trackAccessAttempt({ answer, isCorrect, attempts }) {
  if (!db) return;
  try {
    const { device, browser } = getDeviceInfo();
    await addDoc(collection(db, "access_logs"), {
      visitorId: getOrCreateVisitorId(),
      answer,
      isCorrect,
      attempts,
      answeredAt: serverTimestamp(),
      device,
      browser,
    });
  } catch (err) {
    console.warn("[Analytics] trackAccessAttempt failed:", err.message);
  }
}

// ─── Interaction tracking ────────────────────────────
export async function trackInteraction(data) {
  if (!db) return;
  try {
    const { device, browser } = getDeviceInfo();
    await addDoc(collection(db, "interactions"), {
      visitorId: getOrCreateVisitorId(),
      device,
      browser,
      createdAt: serverTimestamp(),
      ...data,
    });
  } catch (err) {
    console.warn("[Analytics] trackInteraction failed:", err.message);
  }
}

// ─── Admin data fetching ─────────────────────────────
export async function fetchAdminData() {
  if (!db) throw new Error("Firebase not initialized");

  const [visitsSnap, interactionsSnap, accessSnap] = await Promise.all([
    getDocs(query(collection(db, "visits"), orderBy("sessionStart", "desc"))),
    getDocs(query(collection(db, "interactions"), orderBy("createdAt", "desc"))),
    getDocs(query(collection(db, "access_logs"), orderBy("answeredAt", "desc"))),
  ]);

  const visits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const interactions = interactionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const accessLogs = accessSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const uniqueVisitors = new Set(visits.map((v) => v.visitorId)).size;
  const returningVisitors = visits.filter((v) => v.returning).length;
  const totalVisits = visits.length;

  const wishClicks = interactions.filter((i) => i.selectedMenu === "wish").length;
  const memoriesClicks = interactions.filter((i) => i.selectedMenu === "memories").length;
  const videoPlayed = interactions.filter((i) => i.videoPlayed).length;
  const videoCompleted = interactions.filter((i) => i.videoCompleted).length;

  const durationsArr = visits.filter((v) => v.totalDuration).map((v) => v.totalDuration);
  const avgDuration = durationsArr.length ? Math.round(durationsArr.reduce((a, b) => a + b, 0) / durationsArr.length) : 0;

  const lastVisit = visits[0]?.sessionStart?.toDate?.()?.toLocaleString("id-ID") ?? "-";

  // Wrong answers
  const wrongAnswers = accessLogs.filter((a) => !a.isCorrect);
  const answerCount = {};
  wrongAnswers.forEach((a) => {
    answerCount[a.answer] = (answerCount[a.answer] || 0) + 1;
  });
  const topWrongAnswers = Object.entries(answerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([answer, count]) => ({ answer, count }));

  // Visitor profiles
  const visitorMap = {};
  visits.forEach((v) => {
    if (!visitorMap[v.visitorId]) {
      visitorMap[v.visitorId] = { visitorId: v.visitorId, device: v.device, browser: v.browser, visits: 0 };
    }
    visitorMap[v.visitorId].visits++;
  });
  const visitorList = Object.values(visitorMap).sort((a, b) => b.visits - a.visits);

  // Recent activity (last 10)
  const recentActivity = interactions.slice(0, 10);

  return {
    totalVisits,
    uniqueVisitors,
    returningVisitors,
    wishClicks,
    memoriesClicks,
    videoPlayed,
    videoCompleted,
    avgDuration,
    lastVisit,
    topWrongAnswers,
    visitorList,
    recentActivity,
  };
}
