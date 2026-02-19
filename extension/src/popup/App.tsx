import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import AuthScreen from "@/components/AuthScreen";
import MainScreen from "@/components/MainScreen";
import SettingsScreen from "@/components/SettingsScreen";
import HistoryScreen from "@/components/HistoryScreen";
import Header from "@/components/Header";

export type AppScreen = "main" | "settings" | "history";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<AppScreen>("main");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, background: "#0f172a" }}>
        <div style={{ width: 24, height: 24, border: "3px solid #334155", borderTopColor: "#3b82f6", borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 200, background: "#0f172a", color: "#f1f5f9" }}>
      <Header session={session} screen={screen} onNavigate={setScreen} />
      {!session ? (
        <AuthScreen />
      ) : screen === "settings" ? (
        <SettingsScreen onBack={() => setScreen("main")} />
      ) : screen === "history" ? (
        <HistoryScreen onBack={() => setScreen("main")} />
      ) : (
        <MainScreen session={session} />
      )}
    </div>
  );
}
