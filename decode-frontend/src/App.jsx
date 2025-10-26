import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthPage from "./components/auth/AuthPage";
import ProblemPage from "./pages/ProblemPage";
import ExamStartPage from "./pages/StartPage";
import InterviewReport from "./pages/InterviewReport";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import './styles/main.css'; // Import your global CSS here
// We no longer need to import ParticlesComponent here,
// unless a specific page *is* App.js (which isn't the case).
// import ParticlesComponent from "./components/layout/particles";

/* --- Global Styles for DECODE --- */
// (Your CSS from the prompt is included here)
// Make sure this is in a separate .css file (e.g., index.css) 
// and imported at the top level of your app.
/*
:root {
  --background-color: #000000;
  --card-background: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #333333;
  --input-background: #252525;
  --button-background: #ffffff;
  --button-text: #0a0a0a;
  --button-hover-background: #e0e0e0;
}
// ... all your other CSS ...
*/

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter =
    location.pathname === "/auth" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/problem" ||
    location.pathname === "/exam-start"; // hide nav/footer on exam start

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideNavFooter && <Navbar />}
      
      {/* REMOVED! 
        We've taken <ParticlesComponent /> out of this global layout.
        
        TO USE IT: 
        1. Import ParticlesComponent in the page file you want (e.g., src/pages/HomePage.js)
           import ParticlesComponent from "../components/layout/particles";
        2. Add the component inside that page's return:
           <>
             <ParticlesComponent id="tsparticles" />
             <div className="content">...your page content...</div>
           </>
      */}

      <main
         style={{
          flex: 1,
          position: "relative",
          // This zIndex ensures your content stays *above* the
          // particle background (which is now zIndex: -1)
          zIndex: 1, 
          width: "100%",
        }}
      >
        {children}
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem"
          element={
            <ProtectedRoute>
              <Layout>
                <ProblemPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
         path="/exam-start"
          element={
            <ProtectedRoute>
              <Layout>
                <ExamStartPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
         path="/report"
          element={
            <ProtectedRoute>
              <Layout>
                <InterviewReport />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* For your AuthPage, you would now go into 'src/components/auth/AuthPage.js'
          and add the <ParticlesComponent /> inside its return statement.
        */}
        <Route path="/auth" element={<Layout><AuthPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
