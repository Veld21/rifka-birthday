import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { CONFIG } from "./config";

let db = null;
let app = null;

try {
  app = initializeApp(CONFIG.firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.warn("[Analytics] Firebase init failed:", err.message);
}

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

    await setDoc(
      doc(db, "visitor_sessions", visitorId),
      {
        visitorId,
        returning,
        device,
        browser,
        userAgent,
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp(),
        visitIds: arrayUnion(docRef.id),
      },
      { merge: true }
    );

    markVisited();
  } catch (err) {
    console.warn("[Analytics] trackVisit failed:", err.message);
  }
}

export async function trackSessionEnd(lastPage) {
  if (!db || !sessionDocId) return;
  try {
    const visitorId = getOrCreateVisitorId();
    const duration = Math.round((Date.now() - sessionStart) / 1000);

    await updateDoc(doc(db, "visits", sessionDocId), {
      sessionEnd: serverTimestamp(),
      totalDuration: duration,
      lastPageVisited: lastPage,
    });

    await setDoc(
      doc(db, "visitor_sessions", visitorId),
      {
        lastSeen: serverTimestamp(),
        lastPageVisited: lastPage,
        lastDuration: duration,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[Analytics] trackSessionEnd failed:", err.message);
  }
}

export async function trackAccessAttempt({ answer, isCorrect, attempts, context }) {
  if (!db) return;
  try {
    const visitorId = getOrCreateVisitorId();
    const { device, browser } = getDeviceInfo();

    await addDoc(collection(db, "access_logs"), {
      visitorId,
      answer,
      isCorrect,
      attempts,
      context,
      answeredAt: serverTimestamp(),
      device,
      browser,
    });

    await setDoc(
      doc(db, "visitor_sessions", visitorId),
      {
        visitorId,
        device,
        browser,
        lastAccessAnswer: answer,
        lastAccessCorrect: isCorrect,
        lastAccessContext: context,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("[Analytics] trackAccessAttempt failed:", err.message);
  }
}

export async function trackInteraction(data) {
  if (!db) return;
  try {
    const visitorId = getOrCreateVisitorId();
    const { device, browser } = getDeviceInfo();
    const pageName = data.selectedMenu || data.page || data.event || "unknown";

    await setDoc(
      doc(db, "visitor_sessions", visitorId),
      {
        visitorId,
        device,
        browser,
        lastSeen: serverTimestamp(),
        pagesVisited: arrayUnion(pageName),
        lastInteraction: pageName,
      },
      { merge: true }
    );

    await addDoc(collection(db, "interactions"), {
      visitorId,
      device,
      browser,
      createdAt: serverTimestamp(),
      ...data,
    });
  } catch (err) {
    console.warn("[Analytics] trackInteraction failed:", err.message);
  }
}

export async function trackFinalAnswer({ answer }) {
  if (!db) return;
  try {
    const visitorId = getOrCreateVisitorId();
    const { device, browser } = getDeviceInfo();

    await setDoc(
      doc(db, "visitor_sessions", visitorId),
      {
        visitorId,
        device,
        browser,
        finalAnswer: answer,
        finalAnsweredAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        pagesVisited: arrayUnion("one-last-question"),
        lastInteraction: "one-last-question",
      },
      { merge: true }
    );

    await addDoc(collection(db, "interactions"), {
      visitorId,
      event: "oneLastQuestion",
      answer,
      answeredAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      device,
      browser,
    });
  } catch (err) {
    console.warn("[Analytics] trackFinalAnswer failed:", err.message);
  }
}

export async function fetchAdminData() {
  if (!db) throw new Error("Firebase not initialized");

  const [visitsSnap, interactionsSnap, accessSnap, sessionsSnap] = await Promise.all([
    getDocs(query(collection(db, "visits"), orderBy("sessionStart", "desc"))),
    getDocs(query(collection(db, "interactions"), orderBy("createdAt", "desc"))),
    getDocs(query(collection(db, "access_logs"), orderBy("answeredAt", "desc"))),
    getDocs(collection(db, "visitor_sessions")),
  ]);

  const visits = visitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const interactions = interactionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const accessLogs = accessSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const sessions = sessionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const uniqueVisitors = new Set(visits.map((v) => v.visitorId)).size;
  const returningVisitors = visits.filter((v) => v.returning).length;
  const totalVisits = visits.length;

  const wishClicks = interactions.filter((i) => i.selectedMenu === "wish").length;
  const memoriesClicks = interactions.filter((i) => i.selectedMenu === "memories").length;
  const videoPlayed = interactions.filter((i) => i.event === "videoPlay").length;
  const videoCompleted = interactions.filter((i) => i.event === "videoCompleted").length;

  const finalAnswers = interactions.filter((i) => i.event === "oneLastQuestion");
  const answeredYes = finalAnswers.filter((i) => i.answer === "yes").length;
  const answeredNo = finalAnswers.filter((i) => i.answer === "no").length;
  const latestFinalAnswer = finalAnswers[0] ?? null;

  const durationsArr = visits.filter((v) => v.totalDuration).map((v) => v.totalDuration);
  const avgDuration = durationsArr.length
    ? Math.round(durationsArr.reduce((a, b) => a + b, 0) / durationsArr.length)
    : 0;

  const lastVisit = visits[0]?.sessionStart?.toDate?.()?.toLocaleString("id-ID") ?? "-";

  const wrongAnswers = accessLogs.filter((a) => !a.isCorrect);
  const answerCount = {};
  wrongAnswers.forEach((a) => {
    answerCount[a.answer] = (answerCount[a.answer] || 0) + 1;
  });
  const topWrongAnswers = Object.entries(answerCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([answer, count]) => ({ answer, count }));

  // Per-visitor detail
  const visitorMap = {};
  sessions.forEach((s) => {
    visitorMap[s.visitorId] = {
      visitorId: s.visitorId,
      device: s.device,
      browser: s.browser,
      firstSeen: s.firstSeen?.toDate?.()?.toLocaleString("id-ID") ?? "-",
      lastSeen: s.lastSeen?.toDate?.()?.toLocaleString("id-ID") ?? "-",
      pagesVisited: s.pagesVisited ?? [],
      lastInteraction: s.lastInteraction ?? "-",
      finalAnswer: s.finalAnswer ?? null,
      visits: (s.visitIds ?? []).length,
    };
  });

  interactions.forEach((i) => {
    if (visitorMap[i.visitorId]) {
      if (!visitorMap[i.visitorId].interactions) {
        visitorMap[i.visitorId].interactions = [];
      }
      visitorMap[i.visitorId].interactions.push(i);
    }
  });

  const visitorList = Object.values(visitorMap).sort((a, b) => b.visits - a.visits);
  const recentActivity = interactions.slice(0, 10);

  return {
    totalVisits, uniqueVisitors, returningVisitors,
    wishClicks, memoriesClicks, videoPlayed, videoCompleted,
    answeredYes, answeredNo, latestFinalAnswer,
    avgDuration, lastVisit, topWrongAnswers,
    visitorList, recentActivity,
  };
}