import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../utils/cookieHelper";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    removeToken();
    navigate("/auth");
  };

  return (
    <nav
  style={{
    width: "100%", 
    zIndex: 10,          // ← Add this
    backgroundColor: "transparent",
    color: "#fff",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>

      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          DECODE
        </Link>
      </h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Home
        </Link>
        {isLoggedIn && (
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
            Dashboard
          </Link>
        )}
        {!isLoggedIn ? (
          <Link to="/auth" style={{ color: "#fff", textDecoration: "none" }}>
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #fff",
              color: "#fff",
              cursor: "pointer",
              padding: "5px 10px",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
