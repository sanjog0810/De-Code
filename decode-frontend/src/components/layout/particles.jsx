import React, { useEffect, useMemo } from "react";

const ParticlesComponent = ({ id }) => {
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "#ffffff", // ✅ white background
        },
      },
      fullScreen: {
        enable: false,
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "repulse" },
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          push: { distance: 200, duration: 15 },
          grab: { distance: 150 },
        },
      },
      particles: {
        color: { value: "#808080" }, // ✅ grey particles
        links: {
          color: "#808080", // ✅ grey links
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: true,
          speed: 1,
          straight: false,
        },
        number: { density: { enable: true }, value: 150 },
        opacity: { value: 1 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    []
  );

  useEffect(() => {
    const scriptId = "tsparticles-script";
    const libSrc =
      "https://cdn.jsdelivr.net/npm/@tsparticles/slim@3/tsparticles.slim.bundle.min.js";

    const initParticles = () => {
      if (window.tsParticles && id) {
        window.tsParticles
          .load({ id, options })
          .then((container) => console.log("Particles loaded:", container))
          .catch((error) =>
            console.error("Error loading particles:", error)
          );
      }
    };

    if (document.getElementById(scriptId) || window.tsParticles) {
      initParticles();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = libSrc;
      script.async = true;
      script.onload = initParticles;
      script.onerror = () =>
        console.error("Failed to load tsParticles library from CDN.");
      document.body.appendChild(script);
    }
  }, [id, options]);

  return (
    <div
      id={id}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default ParticlesComponent;
