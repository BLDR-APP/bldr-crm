import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/BLDR-CLEAN.png";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Start animation after mount
    const animateTimeout = setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    // Redirect after 3 seconds
    const redirectTimeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(animateTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo}
        alt="BLDR"
        className={`max-w-[280px] md:max-w-[400px] object-contain transition-all duration-1000 ease-out ${
          animateIn 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        }`}
      />
    </div>
  );
};

export default SplashScreen;
