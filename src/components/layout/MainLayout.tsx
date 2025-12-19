import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("bldr_authenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:pl-64">
        <Header />
        <main className="p-4 lg:p-6 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
