import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Users, Calendar, LayoutGrid, HeartPulse, ChevronDown } from "lucide-react";
import HealthDashboard from "./HealthDashboard";
import HealthPatientList from "./HealthPatientList";
// Temporary placeholders until next tasks
import HealthAgenda from "./HealthAgenda";
import HealthPatientRecord from "./HealthPatientRecord";

export default function HealthModule() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper check active route logic
  const isActive = (path) => {
    if (path === "/client/salud" && location.pathname === "/client/salud") return true;
    if (path !== "/client/salud" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: "Dashboard", path: "/client/salud", icon: LayoutGrid },
    { label: "Pacientes", path: "/client/salud/pacientes", icon: Users },
    { label: "Agenda", path: "/client/salud/agenda", icon: Calendar },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Sub-Header Module Internal Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Desktop navigation */}
        <div className="hidden md:flex bg-[var(--color-surface-container)]/50 p-1 rounded-xl border border-[var(--color-outline-variant)] w-fit">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  isCurrent 
                    ? "bg-[#6B4FD8] text-[#002150]" 
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile navigation selector */}
        <div className="md:hidden relative w-full">
          <select
            value={navItems.find(item => isActive(item.path))?.path || "/client/salud"}
            onChange={(e) => navigate(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-bold rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
          >
            {navItems.map((item) => (
              <option key={item.path} value={item.path}>{item.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Routing Viewport */}
      <div className="min-h-[calc(100vh-250px)]">
        <Routes>
          <Route index element={<HealthDashboard />} />
          <Route path="pacientes" element={<HealthPatientList />} />
          <Route path="pacientes/:clientId" element={<HealthPatientRecord />} />
          <Route path="agenda" element={<HealthAgenda />} />
        </Routes>
      </div>
    </div>
  );
}
