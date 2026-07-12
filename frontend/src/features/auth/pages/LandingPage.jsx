import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dashboardPreview from "../../../assets/dashboard-preview.png";
import "../styles/landing.css";

// SVG icon components
const CheckCircle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// Feature icons
const FleetIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
);

const DispatchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

const AnalyticsIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

// Workflow icons
const RegisterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
    </svg>
);

const AssignIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
);

const CreateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

const TrackIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
);

const CompleteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const observerRef = useRef(null);

    // Scroll-triggered animation observer
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll(".lp-animate").forEach((el) => {
            observerRef.current.observe(el);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector(".lp-navbar");
            if (navbar) {
                navbar.classList.toggle("scrolled", window.scrollY > 20);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const goToAuth = () => navigate("/auth");

    return (
        <div className="landing-page">
            {/* ───── Navbar ───── */}
            <nav className="lp-navbar" id="landing-navbar">
                <a href="#" className="lp-navbar-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    <div className="lp-navbar-logo">
                        {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
                    </div>
                    <span className="lp-navbar-name">TransitOps</span>
                </a>

                <ul className="lp-navbar-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#solutions">Solutions</a></li>
                    <li><a href="#workflow">Modules</a></li>
                    <li><a href="#stats">Resources</a></li>
                    <li><a href="#cta">About</a></li>
                    <li><a href="#footer">Contact</a></li>
                </ul>

                <div className="lp-navbar-actions">
                    <button className="lp-btn-login" onClick={goToAuth} id="nav-login-btn">Login</button>
                    <button className="lp-btn-cta" onClick={goToAuth} id="nav-get-started-btn">Get Started</button>
                </div>

                <button className="lp-mobile-toggle" aria-label="Toggle menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </nav>

            {/* ───── Hero ───── */}
            <section className="lp-hero" id="hero">
                <div className="lp-hero-content">
                    <div className="lp-hero-badge">
                        <span className="lp-hero-badge-dot" />
                        Smart Fleet Management Platform
                    </div>

                    <h1 className="lp-hero-title">
                        Manage Your Entire{" "}
                        <span className="gold">Transport Operations</span>{" "}
                        From One Intelligent Platform
                    </h1>

                    <p className="lp-hero-desc">
                        A comprehensive, high-density operations hub for logistics managers.
                        Unify vehicle tracking, driver allocation, complex dispatching, and
                        actionable analytics into a single, reliable interface.
                    </p>

                    <div className="lp-hero-actions">
                        <button className="lp-btn-hero-primary" onClick={goToAuth} id="hero-get-started-btn">
                            Get Started <ArrowRight />
                        </button>
                        <button className="lp-btn-hero-secondary" id="hero-book-demo-btn">
                            <CalendarIcon /> Book Demo
                        </button>
                    </div>

                    <div className="lp-hero-tags">
                        <span className="lp-hero-tag"><CheckCircle /> Fleet Tracking</span>
                        <span className="lp-hero-tag"><CheckCircle /> Smart Dispatch</span>
                        <span className="lp-hero-tag"><CheckCircle /> Enterprise Security</span>
                    </div>
                </div>

                <div className="lp-hero-visual">
                    <div className="lp-dashboard-frame">
                        <div className="lp-dashboard-topbar">
                            <span className="lp-dashboard-dot red" />
                            <span className="lp-dashboard-dot yellow" />
                            <span className="lp-dashboard-dot green" />
                            <span className="lp-dashboard-url">app.transitops.com/dashboard</span>
                        </div>
                        <div className="lp-dashboard-body">
                            <img src={dashboardPreview} alt="TransitOps Fleet Dashboard" loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ───── Trusted By ───── */}
            <section className="lp-trusted lp-animate" id="solutions">
                <p className="lp-trusted-label">Trusted by Leading Logistics Teams</p>
                <div className="lp-trusted-logos">
                    <span className="lp-trusted-logo">GlobalFreight</span>
                    <span className="lp-trusted-logo">LogisTech</span>
                    <span className="lp-trusted-logo">TransPort Solutions</span>
                    <span className="lp-trusted-logo">RouteMax</span>
                    <span className="lp-trusted-logo">FleetWorks</span>
                </div>
            </section>

            {/* ───── Features ───── */}
            <section className="lp-features lp-animate" id="features">
                <div className="lp-section-header">
                    <p className="lp-section-label">Core Capabilities</p>
                    <h2 className="lp-section-title">Everything You Need to Run Your Fleet</h2>
                    <p className="lp-section-subtitle">
                        From vehicle registration to real-time dispatch, every tool designed for
                        modern transport operations.
                    </p>
                </div>

                <div className="lp-features-grid">
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><FleetIcon /></div>
                        <h3 className="lp-feature-title">Fleet Management</h3>
                        <p className="lp-feature-desc">
                            Register, track, and maintain your entire vehicle fleet with real-time status
                            updates and maintenance scheduling.
                        </p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><DispatchIcon /></div>
                        <h3 className="lp-feature-title">Smart Dispatching</h3>
                        <p className="lp-feature-desc">
                            Intelligent route optimization and automated dispatch assignments to maximize
                            efficiency and reduce fuel costs.
                        </p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><AnalyticsIcon /></div>
                        <h3 className="lp-feature-title">Advanced Analytics</h3>
                        <p className="lp-feature-desc">
                            Comprehensive dashboards with fuel consumption trends, trip analytics, and
                            performance KPIs at a glance.
                        </p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><ShieldIcon /></div>
                        <h3 className="lp-feature-title">Enterprise Security</h3>
                        <p className="lp-feature-desc">
                            Role-based access control with four distinct roles — Fleet Manager, Dispatcher,
                            Safety Officer, and Financial Analyst.
                        </p>
                    </div>
                </div>
            </section>

            {/* ───── How It Works ───── */}
            <section className="lp-workflow lp-animate" id="workflow">
                <div className="lp-section-header">
                    <p className="lp-section-label">Workflow</p>
                    <h2 className="lp-section-title">How TransitOps Works</h2>
                    <p className="lp-section-subtitle">
                        A streamlined, logical progression from data entry to actionable intelligence.
                    </p>
                </div>

                <div className="lp-workflow-steps">
                    {[
                        { icon: <RegisterIcon />, label: "Register" },
                        { icon: <AssignIcon />, label: "Assign" },
                        { icon: <CreateIcon />, label: "Create" },
                        { icon: <PlayIcon />, label: "Dispatch" },
                        { icon: <TrackIcon />, label: "Track" },
                        { icon: <CompleteIcon />, label: "Complete" },
                        { icon: <ChartIcon />, label: "Analytics" },
                    ].map((step, i) => (
                        <div className="lp-workflow-step" key={i}>
                            <div className="lp-workflow-icon">{step.icon}</div>
                            <span className="lp-workflow-label">{step.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───── Stats ───── */}
            <section className="lp-stats lp-animate" id="stats">
                <div className="lp-stats-grid">
                    <div className="lp-stat-item">
                        <div className="lp-stat-value">48+</div>
                        <div className="lp-stat-label">Active Vehicles</div>
                    </div>
                    <div className="lp-stat-item">
                        <div className="lp-stat-value">156</div>
                        <div className="lp-stat-label">Total Trips</div>
                    </div>
                    <div className="lp-stat-item">
                        <div className="lp-stat-value">97.1%</div>
                        <div className="lp-stat-label">On-Time Rate</div>
                    </div>
                    <div className="lp-stat-item">
                        <div className="lp-stat-value">4</div>
                        <div className="lp-stat-label">RBAC Roles</div>
                    </div>
                </div>
            </section>

            {/* ───── CTA ───── */}
            <section className="lp-cta lp-animate" id="cta">
                <div className="lp-cta-card">
                    <h2 className="lp-cta-title">Ready to Streamline Your Fleet?</h2>
                    <p className="lp-cta-desc">
                        Join logistics teams already managing their operations smarter with TransitOps.
                        Get started in minutes.
                    </p>
                    <div className="lp-cta-actions">
                        <button className="lp-btn-cta-white" onClick={goToAuth} id="cta-get-started-btn">
                            Get Started Free <ArrowRight />
                        </button>
                        <button className="lp-btn-cta-outline" id="cta-demo-btn">Schedule Demo</button>
                    </div>
                </div>
            </section>

            {/* ───── Footer ───── */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-top">
                    <div className="lp-footer-brand">
                        <div className="lp-footer-logo">
                            <div className="lp-footer-logo-icon">
                                {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
                            </div>
                            <span className="lp-footer-logo-name">TransitOps</span>
                        </div>
                        <p className="lp-footer-tagline">
                            Smart transport operations platform. Real-time tracking, intelligent routing,
                            and comprehensive analytics.
                        </p>
                    </div>

                    <div className="lp-footer-column">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#features">Fleet Management</a></li>
                            <li><a href="#features">Dispatching</a></li>
                            <li><a href="#features">Analytics</a></li>
                            <li><a href="#features">Driver Portal</a></li>
                        </ul>
                    </div>

                    <div className="lp-footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#cta">About Us</a></li>
                            <li><a href="#cta">Careers</a></li>
                            <li><a href="#footer">Contact</a></li>
                            <li><a href="#cta">Blog</a></li>
                        </ul>
                    </div>

                    <div className="lp-footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#cta">Documentation</a></li>
                            <li><a href="#cta">API Reference</a></li>
                            <li><a href="#cta">Status Page</a></li>
                            <li><a href="#footer">Help Center</a></li>
                        </ul>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <span>TRANSITOPS © 2026 · All rights reserved.</span>
                    <div className="lp-footer-socials">
                        <a href="#" className="lp-footer-social" aria-label="Twitter">𝕏</a>
                        <a href="#" className="lp-footer-social" aria-label="LinkedIn">in</a>
                        <a href="#" className="lp-footer-social" aria-label="GitHub">⌘</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
