import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const handleVideoEnd = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  useEffect(() => {
    // Fallback: if video doesn't load or takes too long, redirect after 10s
    const timeout = setTimeout(() => {
      handleVideoEnd();
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/videos/BLDR_CRM_-_SPLASH.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default SplashScreen;
