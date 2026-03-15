import { useState, useEffect } from "react";

// ─── Inline styles (no Tailwind needed) ───────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:   #0a0a0a;
    --ink:     #111111;
    --card:    #161616;
    --border:  rgba(255,255,255,0.08);
    --muted:   #888;
    --cream:   #f5f0e8;
    --gold:    #c9a96e;
    --gold-lt: #e8d4a8;
    --white:   #ffffff;
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body:    'DM Sans', system-ui, sans-serif;
  }

  html, body, #root { height: 100%; }
  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    border-bottom: 1px solid transparent;
    transition: background .4s, border-color .4s, backdrop-filter .4s;
  }
  .nav.scrolled {
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(12px);
    border-color: var(--border);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: .04em;
    color: var(--cream);
    text-decoration: none;
  }
  .nav-logo span { color: var(--gold); }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-link {
    font-size: 13px; font-weight: 400; letter-spacing: .06em;
    text-transform: uppercase; color: var(--muted);
    text-decoration: none; cursor: pointer;
    transition: color .2s;
  }
  .nav-link:hover { color: var(--white); }
  .nav-cta {
    font-size: 13px; font-weight: 500; letter-spacing: .06em;
    text-transform: uppercase; color: var(--black);
    background: var(--gold); border: none; border-radius: 2px;
    padding: 9px 22px; cursor: pointer; transition: background .2s;
  }
  .nav-cta:hover { background: var(--gold-lt); }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 120px 32px 80px;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 20%, rgba(201,169,110,.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 80%, rgba(201,169,110,.04) 0%, transparent 50%),
      radial-gradient(ellipse 50% 50% at 20% 60%, rgba(201,169,110,.03) 0%, transparent 50%);
  }
  .hero-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: .2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 24px;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(56px, 9vw, 110px);
    font-weight: 600; line-height: 1;
    letter-spacing: -.01em;
    color: var(--cream);
    margin-bottom: 8px;
  }
  .hero-title em {
    font-style: italic; color: var(--gold);
  }
  .hero-subtitle {
    font-family: var(--font-display);
    font-size: clamp(18px, 2.5vw, 26px);
    font-weight: 400; font-style: italic;
    color: rgba(245,240,232,.5);
    margin-bottom: 40px;
    max-width: 480px;
  }
  .hero-divider {
    width: 40px; height: 1px;
    background: var(--gold); margin: 0 auto 40px;
    opacity: .5;
  }
  .hero-desc {
    font-size: 16px; font-weight: 300; line-height: 1.7;
    color: rgba(255,255,255,.55); max-width: 520px;
    margin-bottom: 56px;
  }

  /* ── User type cards ── */
  .user-type-row {
    display: flex; gap: 16px; margin-bottom: 40px;
    flex-wrap: wrap; justify-content: center;
  }
  .type-card {
    width: 260px; padding: 28px 24px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 4px; cursor: pointer;
    text-align: left; transition: border-color .25s, transform .2s;
    position: relative; overflow: hidden;
  }
  .type-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: var(--gold); transform: scaleX(0);
    transform-origin: left; transition: transform .3s;
  }
  .type-card:hover { border-color: rgba(201,169,110,.3); transform: translateY(-2px); }
  .type-card:hover::before { transform: scaleX(1); }
  .type-card.selected {
    border-color: var(--gold);
    background: rgba(201,169,110,.06);
  }
  .type-card.selected::before { transform: scaleX(1); }
  .type-icon {
    width: 36px; height: 36px; margin-bottom: 14px;
    border: 1px solid var(--border); border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
  }
  .type-label {
    font-family: var(--font-display);
    font-size: 20px; font-weight: 600;
    color: var(--cream); margin-bottom: 6px;
  }
  .type-desc {
    font-size: 13px; font-weight: 300; line-height: 1.5;
    color: var(--muted);
  }
  .type-badge {
    position: absolute; top: 12px; right: 14px;
    font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
    color: var(--gold); background: rgba(201,169,110,.1);
    padding: 3px 8px; border-radius: 2px;
  }
  .type-check {
    position: absolute; bottom: 14px; right: 16px;
    font-size: 16px; color: var(--gold);
    opacity: 0; transition: opacity .2s;
  }
  .type-card.selected .type-check { opacity: 1; }

  /* ── CTA buttons ── */
  .cta-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .btn-primary {
    font-family: var(--font-body);
    font-size: 13px; font-weight: 500; letter-spacing: .08em;
    text-transform: uppercase; padding: 14px 36px;
    background: var(--gold); color: var(--black);
    border: none; border-radius: 2px; cursor: pointer;
    transition: background .2s, transform .15s;
  }
  .btn-primary:hover { background: var(--gold-lt); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: .4; cursor: default; transform: none; }
  .btn-ghost {
    font-family: var(--font-body);
    font-size: 13px; font-weight: 400; letter-spacing: .08em;
    text-transform: uppercase; padding: 14px 36px;
    background: transparent; color: var(--cream);
    border: 1px solid var(--border); border-radius: 2px; cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,.3); color: var(--white); }

  /* ── Section: Features ── */
  .section { padding: 100px 48px; }
  .section-label {
    font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 600; line-height: 1.05;
    color: var(--cream); margin-bottom: 64px;
    max-width: 600px;
  }
  .section-title em { font-style: italic; color: var(--gold); }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1px; background: var(--border);
    border: 1px solid var(--border);
  }
  .feature-cell {
    background: var(--ink); padding: 36px 32px;
    transition: background .2s;
  }
  .feature-cell:hover { background: var(--card); }
  .feature-num {
    font-family: var(--font-display);
    font-size: 13px; color: var(--gold); letter-spacing: .1em;
    margin-bottom: 16px;
  }
  .feature-title {
    font-family: var(--font-display);
    font-size: 22px; font-weight: 600;
    color: var(--cream); margin-bottom: 10px;
  }
  .feature-desc {
    font-size: 14px; font-weight: 300; line-height: 1.6;
    color: var(--muted);
  }

  /* ── Section: Stats ── */
  .stats-band {
    padding: 64px 48px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    display: flex; flex-wrap: wrap; gap: 48px;
    justify-content: center; align-items: center;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: var(--font-display);
    font-size: 52px; font-weight: 600;
    color: var(--gold); line-height: 1;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 12px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--muted);
  }

  /* ── Signup modal ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,.85);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .modal {
    background: var(--ink);
    border: 1px solid var(--border);
    border-radius: 4px; padding: 48px 40px;
    width: 100%; max-width: 480px;
    animation: slideUp .25s ease;
  }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }
  .modal-close {
    position: absolute; top: 16px; right: 20px;
    background: none; border: none; color: var(--muted);
    font-size: 22px; cursor: pointer;
  }
  .modal-tag {
    font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px;
  }
  .modal-title {
    font-family: var(--font-display);
    font-size: 34px; font-weight: 600;
    color: var(--cream); margin-bottom: 8px;
  }
  .modal-subtitle {
    font-size: 14px; font-weight: 300; color: var(--muted);
    margin-bottom: 32px; line-height: 1.5;
  }
  .modal-type-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    margin-bottom: 24px;
  }
  .modal-type-btn {
    padding: 16px 12px; text-align: center;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 3px; cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .modal-type-btn:hover { border-color: rgba(201,169,110,.3); }
  .modal-type-btn.active {
    border-color: var(--gold);
    background: rgba(201,169,110,.07);
  }
  .modal-type-icon { font-size: 20px; margin-bottom: 6px; }
  .modal-type-label {
    font-size: 13px; font-weight: 500; color: var(--cream); margin-bottom: 2px;
  }
  .modal-type-note { font-size: 11px; color: var(--muted); }
  .modal-input {
    width: 100%; padding: 12px 14px; margin-bottom: 12px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 2px; color: var(--white); font-size: 14px;
    font-family: var(--font-body); outline: none;
    transition: border-color .2s;
  }
  .modal-input:focus { border-color: var(--gold); }
  .modal-input::placeholder { color: var(--muted); }
  .modal-note {
    font-size: 12px; color: var(--muted); margin-bottom: 20px; line-height: 1.5;
  }
  .modal-note span { color: var(--gold); }

  /* ── Footer ── */
  .footer {
    padding: 40px 48px;
    border-top: 1px solid var(--border);
    display: flex; flex-wrap: wrap; gap: 24px;
    align-items: center; justify-content: space-between;
  }
  .footer-logo {
    font-family: var(--font-display);
    font-size: 18px; font-weight: 600; color: var(--cream);
  }
  .footer-logo span { color: var(--gold); }
  .footer-copy { font-size: 12px; color: var(--muted); }

  /* ── Page router ── */
  .page { min-height: 100vh; }

  /* ── Signup success ── */
  .success-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 48px 32px;
  }
  .success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    border: 1px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin: 0 auto 24px;
    color: var(--gold);
  }
  .success-title {
    font-family: var(--font-display);
    font-size: 42px; font-weight: 600; color: var(--cream); margin-bottom: 12px;
  }
  .success-body { font-size: 15px; color: var(--muted); max-width: 400px; line-height: 1.6; }

  @media (max-width: 600px) {
    .nav { padding: 16px 20px; }
    .section { padding: 64px 20px; }
    .stats-band { padding: 48px 20px; gap: 32px; }
    .modal { padding: 36px 24px; }
    .footer { padding: 32px 20px; }
    .user-type-row { gap: 12px; }
    .type-card { width: 100%; max-width: 320px; }
  }
`;

// ─── Route constants ─────────────────────────────────────────────────────────
const ROUTES = { HOME: "home", CREATORS: "creators", FANS: "fans", SUCCESS: "success" };

// ─── Subcomponents ────────────────────────────────────────────────────────────
function Nav({ onSignup, route, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a className="nav-logo" onClick={() => navigate(ROUTES.HOME)} style={{ cursor: "pointer" }}>
        Film<span>Link</span>
      </a>
      <div className="nav-links">
        <span className="nav-link" onClick={() => navigate(ROUTES.CREATORS)}>For Creators</span>
        <span className="nav-link" onClick={() => navigate(ROUTES.FANS)}>For Fans</span>
        <span className="nav-link">Events</span>
        <span className="nav-link">Classes</span>
        <button className="nav-cta" onClick={onSignup}>Join Now</button>
      </div>
    </nav>
  );
}

function UserTypeCard({ icon, label, desc, badge, selected, onClick }) {
  return (
    <div className={`type-card${selected ? " selected" : ""}`} onClick={onClick}>
      {badge && <span className="type-badge">{badge}</span>}
      <div className="type-icon">{icon}</div>
      <div className="type-label">{label}</div>
      <div className="type-desc">{desc}</div>
      <span className="type-check">✓</span>
    </div>
  );
}

function SignupModal({ onClose, defaultType }) {
  const [userType, setUserType] = useState(defaultType || "creator");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ position: "relative" }}>
        <button className="modal-close" onClick={onClose}>×</button>
        {step === 1 ? (
          <>
            <div className="modal-tag">Create your account</div>
            <div className="modal-title">Join FilmLink</div>
            <div className="modal-subtitle">
              The network built for the next generation of film professionals.
            </div>
            <div className="modal-type-row">
              <div
                className={`modal-type-btn${userType === "creator" ? " active" : ""}`}
                onClick={() => setUserType("creator")}
              >
                <div className="modal-type-icon">🎬</div>
                <div className="modal-type-label">Creator</div>
                <div className="modal-type-note">Application required</div>
              </div>
              <div
                className={`modal-type-btn${userType === "fan" ? " active" : ""}`}
                onClick={() => setUserType("fan")}
              >
                <div className="modal-type-icon">🎞</div>
                <div className="modal-type-label">Film Fan</div>
                <div className="modal-type-note">Instant access</div>
              </div>
            </div>
            <input
              className="modal-input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="modal-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="modal-note">
              {userType === "creator" ? (
                <>
                  <span>Creator accounts are reviewed by our team.</span> You'll be asked to upload a headshot, select your profession, and submit your reel after registering.
                </>
              ) : (
                <>
                  <span>Fan accounts get instant access</span> to articles, events, and creator discovery — no approval needed.
                </>
              )}
            </p>
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={!name.trim() || !email.includes("@")}
              onClick={() => setStep(2)}
            >
              {userType === "creator" ? "Begin Application →" : "Create Account →"}
            </button>
          </>
        ) : (
          <>
            <div className="modal-tag">
              {userType === "creator" ? "Creator Application" : "Account Created"}
            </div>
            <div className="modal-title">
              {userType === "creator" ? "One more step" : "Welcome!"}
            </div>
            <div className="modal-subtitle">
              {userType === "creator"
                ? "We'll review your profile and notify you within 48 hours."
                : "Your account is ready. Explore films, events, and rising creators."}
            </div>
            {userType === "creator" && (
              <>
                <input className="modal-input" type="text" placeholder="Your profession (Actor, Director, etc.)" />
                <input className="modal-input" type="url" placeholder="Reel or portfolio link (optional)" />
              </>
            )}
            <button className="btn-primary" style={{ width: "100%" }} onClick={onClose}>
              {userType === "creator" ? "Submit Application" : "Go to My Feed"}
            </button>
            <button
              className="btn-ghost"
              style={{ width: "100%", marginTop: 10 }}
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({ onSignup, navigate }) {
  const [selected, setSelected] = useState(null);

  const features = [
    { num: "01", title: "Project Marketplace", desc: "Post or discover short films, music videos, web series, and indie features. Apply directly with your reel." },
    { num: "02", title: "Creator Profiles", desc: "Build a professional filmography with reels, credits, headshots, and skills. Your digital industry card." },
    { num: "03", title: "Events & Mixers", desc: "RSVP to curated industry events, panels, screenings, and networking mixers in your city." },
    { num: "04", title: "Acting Classes", desc: "Browse vetted coaches, read member reviews, and book classes — online or in person." },
    { num: "05", title: "Industry News", desc: "Curated indie film coverage, festival roundups, interviews, and behind-the-scenes stories." },
    { num: "06", title: "Private Network", desc: "Exclusively for pre-union, emerging talent. Apply once, gain access to the full creative community." },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-eyebrow">The Network for Emerging Film Talent</div>
        <h1 className="hero-title">
          Film<em>Link</em>
        </h1>
        <div className="hero-subtitle">Where the next generation connects</div>
        <div className="hero-divider" />
        <p className="hero-desc">
          A private platform for emerging actors, directors, writers, and cinematographers — plus a community hub for film fans who want closer access to independent cinema.
        </p>

        {/* User type selection */}
        <div className="user-type-row">
          <UserTypeCard
            icon="🎬"
            label="I'm a Creator"
            desc="Actors, directors, writers, editors, and crew looking for projects and connections."
            badge="Application"
            selected={selected === "creator"}
            onClick={() => setSelected("creator")}
          />
          <UserTypeCard
            icon="🎞"
            label="I'm a Film Fan"
            desc="Industry followers who want news, events, and access to rising independent filmmakers."
            selected={selected === "fan"}
            onClick={() => setSelected("fan")}
          />
        </div>

        <div className="cta-row">
          <button
            className="btn-primary"
            onClick={() => onSignup(selected || "creator")}
          >
            {selected === "fan" ? "Join as a Fan" : "Apply to Join"}
          </button>
          <button className="btn-ghost" onClick={() => navigate(ROUTES.CREATORS)}>
            Learn More
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-band">
        {[
          { num: "2,400+", label: "Creative Members" },
          { num: "340+", label: "Active Projects" },
          { num: "80+", label: "Acting Partners" },
          { num: "12", label: "Cities & Growing" },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="section">
        <div className="section-label">Platform Features</div>
        <h2 className="section-title">
          Everything emerging <em>film talent</em> needs, in one place.
        </h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-cell" key={f.num}>
              <div className="feature-num">{f.num}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: "80px 48px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px,4vw,52px)", fontWeight: 600, color: "var(--cream)", marginBottom: 16 }}>
          Ready to find your next <em style={{ color: "var(--gold)" }}>collaboration?</em>
        </div>
        <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 36, maxWidth: 400, margin: "0 auto 36px" }}>
          Join thousands of pre-union creatives who are building careers on FilmLink.
        </p>
        <button className="btn-primary" onClick={() => onSignup("creator")}>
          Apply as a Creator
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">Film<span>Link</span></div>
        <div className="footer-copy">© 2025 FilmLink. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} className="nav-link" style={{ fontSize: 12 }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

function CreatorsPage({ onSignup }) {
  const professions = ["Actor", "Director", "Writer", "Producer", "Cinematographer", "Editor", "Composer", "Sound Designer"];
  return (
    <div className="page" style={{ paddingTop: 80 }}>
      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="hero-bg" />
        <div className="hero-eyebrow">For Creators</div>
        <h1 className="hero-title" style={{ fontSize: "clamp(44px,7vw,88px)" }}>
          Your career <em>starts here</em>
        </h1>
        <div className="hero-divider" />
        <p className="hero-desc">
          FilmLink is built exclusively for pre-union, emerging talent who need a real network — not just a job board.
        </p>
        <button className="btn-primary" onClick={() => onSignup("creator")}>
          Begin Your Application
        </button>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">Who This Is For</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {professions.map((p) => (
            <span
              key={p}
              style={{
                padding: "9px 18px", border: "1px solid var(--border)", borderRadius: 2,
                fontSize: 13, color: "var(--cream)", background: "var(--card)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function FansPage({ onSignup }) {
  return (
    <div className="page" style={{ paddingTop: 80 }}>
      <section className="hero" style={{ minHeight: "70vh" }}>
        <div className="hero-bg" />
        <div className="hero-eyebrow">For Film Fans</div>
        <h1 className="hero-title" style={{ fontSize: "clamp(44px,7vw,88px)" }}>
          Follow the <em>next wave</em>
        </h1>
        <div className="hero-divider" />
        <p className="hero-desc">
          Discover rising filmmakers, attend indie screenings, read curated industry coverage, and get closer to independent cinema than anywhere else.
        </p>
        <button className="btn-primary" onClick={() => onSignup("fan")}>
          Join Free as a Fan
        </button>
      </section>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState(ROUTES.HOME);
  const [modal, setModal] = useState(null); // null | "creator" | "fan"

  const navigate = (r) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openSignup = (type) => setModal(type || "creator");
  const closeModal = () => setModal(null);

  return (
    <>
      <style>{css}</style>
      <Nav onSignup={openSignup} route={route} navigate={navigate} />

      {route === ROUTES.HOME && <HomePage onSignup={openSignup} navigate={navigate} />}
      {route === ROUTES.CREATORS && <CreatorsPage onSignup={openSignup} />}
      {route === ROUTES.FANS && <FansPage onSignup={openSignup} />}

      {modal && (
        <SignupModal defaultType={modal} onClose={closeModal} />
      )}
    </>
  );
}
