"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    let isLoaded = false;
    let interval: ReturnType<typeof setInterval>;

    const updateProgress = () => {
      // Accelerate if loaded, otherwise slow climb
      if (isLoaded) {
        currentProgress += (100 - currentProgress) * 0.2;
      } else {
        currentProgress += (85 - currentProgress) * 0.05;
      }

      const val = Math.min(100, Math.round(currentProgress));
      setProgress(val);

      if (currentProgress >= 99.5) {
        clearInterval(interval);
        setProgress(100);
        
        // Trigger CSS dismissal
        setIsDismissing(true);
        
        // Unmount after CSS animation completes
        setTimeout(() => {
          setIsUnmounted(true);
        }, 700);
      }
    };

    const handleLoad = () => {
      isLoaded = true;
    };

    if (document.readyState === "complete") {
      isLoaded = true;
    } else {
      window.addEventListener("load", handleLoad);
    }

    interval = setInterval(updateProgress, 30);

    // Ultimate React fallback
    const fallback = setTimeout(() => {
      isLoaded = true;
    }, 4000);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearInterval(interval);
      clearTimeout(fallback);
    };
  }, []);

  if (isUnmounted) return null;

  return (
    <div id="loader" className={isDismissing ? "loader-exit" : ""}>
      <span className="loader-logo">Laayers</span>
      <div className="loader-bar-wrap">
        <div 
          className="loader-bar" 
          style={{ width: `${progress}%`, transition: "width 0.1s linear" }} 
        />
        <span className="loader-count">{progress}</span>
      </div>

      {/* 
        ULTIMATE FAILSAFE SCRIPT
        Executes entirely outside React. If mobile browsers crash the JS thread 
        during hydration or third party scripts hang, this vanilla script guarantees 
        the loader overlay is forcibly removed so the user isn't stuck.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(function() {
              var loader = document.getElementById('loader');
              if (loader) {
                loader.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                setTimeout(function() { loader.remove(); }, 500);
              }
            }, 6000);
          `
        }}
      />
    </div>
  );
}
