import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PostJobScreen from "./screens/PostJobScreen";
import MatchScreen from "./screens/MatchScreen";
import TrackingScreen from "./screens/TrackingScreen";
import ReviewScreen from "./screens/ReviewScreen";
import MyJobsScreen from "./screens/MyJobsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import WorkerDashboard from "./screens/WorkerDashboard";
import AdminPanel from "./screens/AdminPanel";
import WorkerRegisterScreen from "./screens/WorkerRegisterScreen";
import BottomNav from "./components/BottomNav";

function AppRouter() {
  const { screen, user } = useApp();

  const renderScreen = () => {
    switch (screen) {
      case "login": return <LoginScreen />;
      case "home": return <HomeScreen />;
      case "postjob": return <PostJobScreen />;
      case "match": return <MatchScreen />;
      case "tracking": return <TrackingScreen />;
      case "review": return <ReviewScreen />;
      case "jobs": return <MyJobsScreen />;
      case "profile": return <ProfileScreen />;
      case "worker": return <WorkerDashboard />;
      case "admin": return <AdminPanel />;
      case "workerregister": return <WorkerRegisterScreen />;
      default: return <LoginScreen />;
    }
  };

  const showNav = user && ["home","jobs","profile"].includes(screen) && user.role === "customer";
  const showWorkerNav = user && ["worker"].includes(screen) && user.role === "worker";

  return (
    <div className="app-shell">
      <div className="screen-content">
        {renderScreen()}
      </div>
      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
