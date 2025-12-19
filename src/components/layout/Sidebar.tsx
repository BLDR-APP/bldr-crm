import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  DollarSign,
  Handshake,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/BLDR-CLEAN.png";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendário", path: "/calendar" },
  { icon: Users, label: "Reuniões", path: "/meetings" },
  { icon: CheckSquare, label: "Tarefas", path: "/tasks" },
  { icon: DollarSign, label: "Financeiro", path: "/finance" },
  { icon: Handshake, label: "Parceiros", path: "/partners" },
  { icon: FileText, label: "Documentos", path: "/documents" },
  { icon: BarChart3, label: "Relatórios", path: "/reports" },
];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("bldr_authenticated");
    localStorage.removeItem("bldr_user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-center h-24 px-4 border-b border-sidebar-border">
            <img src={logo} alt="BLDR CRM" className="h-20 object-contain" />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) onToggle();
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : ""
                        )}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-all duration-200 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={onToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};

export default Sidebar;
