import React from "react";
import { Link } from "react-router-dom"; // Use Link for internal navigation

function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* --- 1. Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Stop Grinding.
            <br />
            Start <span className="text-highlight">Interviewing.</span>
          </h1>
          <p className="hero-subtitle">
            DECODE is the AI-powered simulation that prepares you for the one
            thing LeetCode can't: a real, high-pressure SDE interview.
          </p>
          <div className="hero-cta-group">
            <Link to="/dashboard" className="btn btn-primary">
              Start Your First Simulation
            </Link>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- 2. Story Section (Color Block) --- */}
      <section className="story-block color-block-accent">
        <div className="section-content grid-layout">
          <div className="story-intro">
            <span className="story-eyebrow">A Note From a Senior</span>
            <h2 className="story-title">I've Been Exactly Where You Are.</h2>
          </div>
          <div className="story-body">
            <p>
              "I grinded the sheets and solved hundreds of problems on LeetCode
              and Codeforces. I thought I was ready. But my first real
              interview was a shock."
            </p>
            <p>
              "The problem isn't just knowing DSA. It's performing under
              pressure. In most interviews, you're asked to write code on a
              notepad or a basic editor. You can't run it. You can't debug.
              Getting the logic, edge cases, and optimization right{" "}
              <strong>on the first try</strong> is what separates a good
              candidate from a great one. That's the skill I built DECODE to
              teach."
            </p>
          </div>
        </div>
      </section>

      {/* --- 3. The Problem Section --- */}
      <section className="problem-section">
        <div className="section-content">
          <h2 className="section-title">The "Notepad Test"</h2>
          <p className="section-subtitle">
            Why hitting "Run Code" 50 times builds the wrong muscle memory.
          </p>
          <div className="problem-box">
            <h3 className="problem-box-title">
              The "First-Time-Right" Impression
            </h3>
            <p>
              An interviewer doesn't care if you find the solution after 10
              attempts. They care if you can build a clean, efficient, and
              correct solution from the start.
            </p>
            <p>
              DECODE simulates this "no-run" environment. We test you on what
              interviewers *actually* look for.
            </p>
          </div>
        </div>
      </section>

      {/* --- 4. Features Section --- */}
      <section id="features" className="features-section">
        <div className="section-content">
          <h2 className="section-title">Welcome to Your AI Interviewer</h2>
          <p className="section-subtitle">
            DECODE tests you on the metrics that matter.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <h3>1. Logic & Optimization</h3>
              <p>
                Our AI doesn't just check your output. It analyzes your
                approach. Is it brute-force? Is it optimal? It pushes you to
                think about efficiency first.
              </p>
            </div>
            <div className="feature-card">
  <h3>2. Code Cleanliness</h3>
  <p>
    Did you use meaningful variable names? Is your code readable and
    well-structured? This is a massive part of the "impression"
    you give.
  </p> {/* <--- THIS IS THE FIX */}
</div>
            <div className="feature-card">
              <h3>3. Complexity Analysis</h3>
              <p>
                After you code, the AI will ask you to justify your Time and
                Space complexity. Just like a real interviewer, it will
                challenge your analysis.
              </p>
            </div>
            <div className="feature-card">
              <h3>4. 1500+ Unique Problems</h3>
              <p>
                Forget memorized solutions from "Top 100" lists. Our problem
                bank is designed to test your *thinking process*, not your
                memory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. Final CTA (Color Block) --- */}
      <section className="cta-block color-block-accent">
        <div className="section-content">
          <h2 className="cta-title">
            Don't Just Practice DSA.
            <br />
            Practice the Interview.
          </h2>
          <p className="cta-subtitle">
            Be ready for any question. Be confident on any platform. Be the
            engineer they want to hire.
          </p>
          <Link to="/register" className="btn btn-light">
            Sign Up and DECODE Your Future
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;