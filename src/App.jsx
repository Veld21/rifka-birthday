import { useState, useEffect, useCallback } from "react";
import { CONFIG } from "./config";
import { trackVisit, trackSessionEnd } from "./firebase";
import CountdownPage from "./components/CountdownPage";
import AccessQuestionPage from "./components/AccessQuestionPage";
import HomePage from "./components/HomePage";
import WishPage from "./components/WishPage";
import MemoriesPage from "./components/MemoriesPage";
import ClosedPage from "./components/ClosedPage";
import AdminPage from "./components/AdminPage";
import "./styles.css";

// ─── Date logic ──────────────────────────────────────
function getDatePhase() {
  const now = Date.now();
  const open = new Date(CONFIG.openDate).getTime();
  const close = new Date(CONFIG.closeDate).getTime();

  if (now < open) return "countdown";
  if (now >= open && now < close) return "open";
  return "closed";
}

// ─── Simple hash router ──────────────────────────────
function getRoute() {
  return window.location.pathname;
}

export default function App() {
  const isAdmin = getRoute() === "/admin";

  const [phase] = useState(getDatePhase);
  const [appState, setAppState] = useState("question"); // question | home | wish | memories
  const [lastPage, setLastPage] = useState("home");

  // Track visit on mount
  useEffect(() => {
    if (!isAdmin) {
      trackVisit();
    }
  }, [isAdmin]);

  // Track session end on unload
  useEffect(() => {
    const handler = () => trackSessionEnd(lastPage);
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [lastPage]);

  const navigate = useCallback((page) => {
    setAppState(page);
    setLastPage(page);
    window.scrollTo(0, 0);
  }, []);

  // Admin route
  if (isAdmin) return <AdminPage />;

  // Date gates
  if (phase === "countdown") return <CountdownPage />;
  if (phase === "closed") return <ClosedPage />;

  // Phase: open
  if (appState === "question") {
    return <AccessQuestionPage onSuccess={() => navigate("home")} />;
  }

  if (appState === "wish") {
    return <WishPage onBack={() => navigate("home")} />;
  }

  if (appState === "memories") {
    return <MemoriesPage onBack={() => navigate("home")} />;
  }

  return <HomePage onNavigate={navigate} />;
}
