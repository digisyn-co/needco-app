import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const AppContext = createContext(null);

export const WORKERS = [
  { id: 1, name: "Miguel Santos", initials: "MS", skills: ["Plumbing","Electrical"], rating: 4.9, jobs: 47, distance: 0.8, price: { Plumbing: 380, Electrical: 420, Cleaning: 300, Moving: 650 }, color: "#1D9E75", bg: "#E1F5EE" },
  { id: 2, name: "Ana Reyes", initials: "AR", skills: ["Cleaning","Plumbing"], rating: 4.7, jobs: 61, distance: 1.4, price: { Plumbing: 360, Electrical: 400, Cleaning: 260, Moving: 600 }, color: "#185FA5", bg: "#E6F1FB" },
  { id: 3, name: "Carlo Dizon", initials: "CD", skills: ["Electrical","Moving"], rating: 4.5, jobs: 23, distance: 2.1, price: { Plumbing: 350, Electrical: 390, Cleaning: 250, Moving: 580 }, color: "#854F0B", bg: "#FAEEDA" },
  { id: 4, name: "Luz Fernandez", initials: "LF", skills: ["Cleaning","Moving"], rating: 4.8, jobs: 38, distance: 3.0, price: { Plumbing: 370, Electrical: 410, Cleaning: 270, Moving: 620 }, color: "#3B6D11", bg: "#EAF3DE" },
];

export const SERVICES = [
  { id: "plumbing",    name: "Plumbing",    icon: "🔧", base: 350, desc: "Leaks, pipes, fixtures" },
  { id: "electrical",  name: "Electrical",  icon: "⚡", base: 400, desc: "Wiring, panels, outlets" },
  { id: "cleaning",    name: "Cleaning",    icon: "🧹", base: 250, desc: "Deep clean, maintenance" },
  { id: "moving",      name: "Moving",      icon: "📦", base: 600, desc: "Packing, transport" },
  { id: "carpentry",   name: "Carpentry",   icon: "🔨", base: 450, desc: "Furniture, repairs" },
  { id: "aircon",      name: "Aircon",      icon: "❄️", base: 500, desc: "Install, clean, repair" },
];

const MOCK_JOBS = [
  { id: 1, service: "Plumbing", desc: "Pipe leak fix", worker: "Miguel Santos", date: "Today", price: 380, status: "active" },
  { id: 2, service: "Cleaning", desc: "Deep clean – 2BR", worker: "Ana Reyes", date: "Apr 3", price: 250, status: "done" },
  { id: 3, service: "Electrical", desc: "Panel inspection", worker: "Carlo Dizon", date: "Mar 28", price: 400, status: "done" },
];

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [jobForm, setJobForm] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ 
          name: session.user.user_metadata?.full_name || session.user.email, 
          email: session.user.email,
          role: "customer",
          initials: (session.user.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()
        });
        setScreen("home");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ 
          name: session.user.user_metadata?.full_name || session.user.email, 
          email: session.user.email,
          role: "customer",
          initials: (session.user.user_metadata?.full_name || "U").substring(0, 2).toUpperCase()
        });
        setScreen("home");
      } else {
        setUser(null);
        setScreen("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigate = (s) => setScreen(s);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("login");
  };

  const postJob = (form) => {
    const newJob = { id: Date.now(), service: selectedService?.name, desc: form.desc, worker: selectedWorker?.name || null, date: "Today", price: selectedWorker?.price[selectedService?.name] || selectedService?.base, status: "active" };
    setActiveJob(newJob);
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <AppContext.Provider value={{ screen, navigate, user, logout, selectedService, setSelectedService, jobForm, setJobForm, selectedWorker, setSelectedWorker, jobs, setJobs, activeJob, setActiveJob, postJob }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
