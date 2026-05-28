import { useState, useEffect, useCallback } from "react";
import { CONFIG } from "./config";
import { trackVisit, trackSessionEnd, trackFinalAnswer } from "./firebase";
import CountdownPage from "./components/CountdownPage";
import AccessQuestionPage from "./components/AccessQuestionPage";
import QuestionGatePage from "./components/QuestionGatePage";
import HomePage from "./components/HomePage";
import WishPage from "./components/WishPage";
import MemoriesPage from "./components/MemoriesPage";
import ThingsNeverSaidPage from "./components/ThingsNeverSaidPage";
import ReadyPage from "./components/ReadyPage";
import OneLastQuestionPage from "./components/OneLastQuestionPage";
import EndingPage from "./components/EndingPage";
import GoodbyePage from "./components/GoodbyePage";
import LockedPage from "./components/LockedPage";
import ClosedPage from "./components/ClosedPage";
import YesPage from "./components/YesPage";
import AdminPage from "./components/AdminPage";
import "./styles.css";

function getDatePhase() {
  const now = Date.now();
  const open = new Date(CONFIG.openDate).getTime();
  const close = new Date(CONFIG.closeDate).getTime();

  if (now < open) return "countdown";
  if (now >= open && now < close) return "open";
  return "closed";
}

function getRoute() {
  return window.location.pathname;
}

function getLockedAnswer() {
  return localStorage.getItem("rifka_final_answer");
}

function PageTransition({ children, pageKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, [pageKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        minHeight: "100dvh",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const isAdmin = getRoute() === "/admin";
  const [phase] = useState(getDatePhase);

  const [appState, setAppState] = useState(() => {
    const answer = getLockedAnswer();
    if (answer === "yes") return "yes-ending";
    if (answer === "no") return "locked";
    return "question";
  });

  const [lastPage, setLastPage] = useState("home");

  useEffect(() => {
    if (!isAdmin) trackVisit();
  }, [isAdmin]);

  useEffect(() => {
    const handler = () => trackSessionEnd(lastPage);
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [lastPage]);

  const navigate = useCallback((page) => {
    const answer = getLockedAnswer();
    if (answer === "yes" && page !== "yes-ending") return;
    if (answer === "no" && page !== "locked") return;
    setAppState(page);
    setLastPage(page);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (isAdmin) return <AdminPage />;
  if (phase === "countdown") return <CountdownPage />;
  if (phase === "closed") return <ClosedPage />;

  const wrap = (key, node) => (
    <PageTransition pageKey={key}>{node}</PageTransition>
  );

  // ── YES ENDING ──────────────────────────────────────
  if (appState === "yes-ending") {
    return wrap("yes-ending", <YesPage />);
  }

  // ── LOCKED AFTER NO ─────────────────────────────────
  if (appState === "locked") {
    return wrap("locked", <LockedPage answer={getLockedAnswer()} />);
  }

  // ── ENTRY GATE ──────────────────────────────────────
  if (appState === "question") {
    return wrap(
      "question",
      <AccessQuestionPage onSuccess={() => navigate("home")} />
    );
  }

  // ── HOME ────────────────────────────────────────────
  if (appState === "home") {
    return wrap("home", <HomePage onNavigate={navigate} />);
  }

  // ── WISH ────────────────────────────────────────────
  if (appState === "wish") {
    return wrap(
      "wish",
      <WishPage
        onBack={() => navigate("home")}
        onContinue={() => navigate("memories-gate")}
      />
    );
  }

  // ── GATE: MEMORIES ──────────────────────────────────
  if (appState === "memories-gate") {
    return wrap(
      "memories-gate",
      <QuestionGatePage
        question="Kapan pertama kali kita bertemu di stasiun?"
        correctAnswer="1 Mei"
        onSuccess={() => navigate("memories")}
        onBack={() => navigate("home")}
        hint="Contoh: 1 Mei"
      />
    );
  }

  // ── MEMORIES ────────────────────────────────────────
  if (appState === "memories") {
    return wrap(
      "memories",
      <MemoriesPage
        onBack={() => navigate("home")}
        onContinue={() => navigate("things-gate")}
      />
    );
  }

  // ── GATE: THINGS I NEVER SAID ───────────────────────
  if (appState === "things-gate") {
    return wrap(
      "things-gate",
      <QuestionGatePage
        question="Kapan aku lahir?"
        correctAnswer="8 Juni"
        onSuccess={() => navigate("things")}
        onBack={() => navigate("home")}
        hint="Tanggal Dan Bulan :)"
      />
    );
  }

  // ── THINGS I NEVER SAID ─────────────────────────────
  if (appState === "things") {
    return wrap(
      "things",
      <ThingsNeverSaidPage
        onBack={() => navigate("home")}
        onContinue={() => navigate("ready")}
      />
    );
  }

  // ── READY ───────────────────────────────────────────
  if (appState === "ready") {
    return wrap(
      "ready",
      <ReadyPage
        onReady={() => navigate("one-last-question")}
        onBack={() => navigate("home")}
      />
    );
  }

  // ── ONE LAST QUESTION ───────────────────────────────
  if (appState === "one-last-question") {
    return wrap(
      "one-last-question",
      <OneLastQuestionPage
        onYes={() => {
          localStorage.setItem("rifka_final_answer", "yes");
          trackFinalAnswer({ answer: "yes" });
          setAppState("yes-ending");
          setLastPage("yes-ending");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
        onNo={() => {
          localStorage.setItem("rifka_final_answer", "no");
          trackFinalAnswer({ answer: "no" });
          setAppState("locked");
          setLastPage("locked");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  // ── ENDING ──────────────────────────────────────────
  if (appState === "ending") {
    return wrap(
      "ending",
      <EndingPage
        onDone={() => navigate("goodbye")}
        onRestart={() => navigate("home")}
      />
    );
  }

  // ── GOODBYE ─────────────────────────────────────────
  if (appState === "goodbye") {
    return wrap("goodbye", <GoodbyePage />);
  }

  return wrap("home", <HomePage onNavigate={navigate} />);
}