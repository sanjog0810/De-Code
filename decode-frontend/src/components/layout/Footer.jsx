import React from "react";

export default function Footer() {
  return (
<footer
  style={{
    width: "100%",
    backgroundColor: "transparent",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    zIndex: 2,        // ensure it's above particles
    position: "relative",
  }}
>

      <p>© {new Date().getFullYear()} DECODE. All rights reserved.</p>
    </footer>
  );
}
