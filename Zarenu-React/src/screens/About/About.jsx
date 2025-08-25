import React from "react";
import "./about.css";

export const About = () => {
  return (
    <div className="zare-nu">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img
            className="logo"
            alt="Zare Nu Logo"
            src="/img/logo-3.png"
          />
          <nav className="nav-group">
            <a className="nav-link" href="/fo">Find Opportunities</a>
            <a className="nav-link" href="/rv">Recruit Volunteer</a>
            <a className="nav-link active" href="/about">About</a>
            <a className="nav-link" href="/login">Log In</a>
            <a className="donate-btn" href="/donate">❤️ Donate</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">About Zare Nu</h1>
        <p className="page-subtitle">
          Empowering communities through volunteer opportunities and creating lasting change in Ethiopia
        </p>
      </section>

      {/* Main Content */}
      <main className="about-content">
        
        {/* Our Story Section */}
        <section className="section">
          <h2 className="section-title">Our Story</h2>
          <div className="section-content">
            <p>
              Zare Nu was founded with a simple yet powerful vision: to bridge the gap between passionate volunteers 
              and meaningful opportunities to serve communities across Ethiopia. We believe that everyone has the power 
              to make a difference, and we're here to help you find your perfect volunteer match.
            </p>
            <br />
            <p>
              Since our inception, we've been committed to creating sustainable change through strategic partnerships, 
              community-driven initiatives, and innovative approaches to volunteer engagement. Our platform connects 
              individuals, organizations, and communities to build a stronger, more resilient Ethiopia.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <h2 className="section-title">Our Mission & Vision</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <span className="mission-icon">🎯</span>
              <h3>Our Mission</h3>
              <p>
                To connect passionate volunteers with meaningful opportunities that create lasting 
                positive impact in Ethiopian communities through innovative technology and strategic partnerships.
              </p>
            </div>
            <div className="mission-card">
              <span className="mission-icon">👁️</span>
              <h3>Our Vision</h3>
              <p>
                A thriving Ethiopia where every individual has the opportunity to contribute their skills 
                and passion toward building stronger, more resilient communities.
              </p>
            </div>
            <div className="mission-card">
              <span className="mission-icon">⭐</span>
              <h3>Our Values</h3>
              <p>
                Integrity, community empowerment, sustainable development, cultural respect, 
                and collaborative partnership guide everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2 className="section-title stats-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Volunteers Connected</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">Partner Organizations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Communities Served</span>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2 className="section-title">What Drives Us</h2>
          <div className="values-grid">
            <div className="value-item">
              <span className="value-icon">🤝</span>
              <h3 className="value-title">Community First</h3>
              <p className="value-description">
                Every initiative starts with understanding and respecting local community needs and priorities.
              </p>
            </div>
            <div className="value-item">
              <span className="value-icon">🌱</span>
              <h3 className="value-title">Sustainable Impact</h3>
              <p className="value-description">
                We focus on creating long-term, sustainable solutions that continue to benefit communities.
              </p>
            </div>
            <div className="value-item">
              <span className="value-icon">💡</span>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                Using technology and creative approaches to make volunteer engagement more effective and accessible.
              </p>
            </div>
            <div className="value-item">
              <span className="value-icon">🎓</span>
              <h3 className="value-title">Empowerment</h3>
              <p className="value-description">
                Building local capacity and empowering individuals to become leaders in their own communities.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section team-section">
          <h2 className="section-title">Our Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3 className="member-name">Dr.Tsiege Tessema </h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">
                Passionate about community development with 15+ years of experience in NGO leadership and social impact initiatives across Ethiopia.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3 className="member-name">Name</h3>
              <p className="member-role">Designation</p>
              <p className="member-bio">
                Expert in volunteer coordination and community engagement, leading our innovative programs that connect volunteers with impactful opportunities.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍🔬</div>
              <h3 className="member-name">Name</h3>
              <p className="member-role">Designation</p>
              <p className="member-bio">
                Tech innovator developing digital solutions to streamline volunteer engagement and maximize community impact through technology.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="footer-container">
        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Zare Nu</h4>
              <p>123 St address<br />Ethiopia</p>
            </div>
            
            <div className="footer-column">
              <h4>About</h4>
              <a href="https://cone-emu-wzrz.squarespace.com/our-vision" target="_blank" rel="noopener noreferrer">
                Our Vision
              </a>
              <a href="https://cone-emu-wzrz.squarespace.com/donate" target="_blank" rel="noopener noreferrer">
                Donate
              </a>
            </div>
            
            <div className="footer-column">
              <h4>Projects</h4>
              <a href="https://cone-emu-wzrz.squarespace.com/materials-for-learning" target="_blank" rel="noopener noreferrer">
                Materials for Learning
              </a>
              <a href="#">Services</a>
              <a href="#">Volunteers</a>
            </div>
            
            <div className="footer-column">
              <h4>Find Opportunity</h4>
              <a href="#">Education</a>
              <a href="#">Sports</a>
              <a href="#">Advocate</a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="footer-legal">
          <p>
            <a href="#" target="_blank" rel="noopener noreferrer">TERMS & CONDITIONS</a> | 
            <a href="#" target="_blank" rel="noopener noreferrer"> PRIVACY POLICY</a> | 
            ACCESSIBILITY STATEMENT<br />
            Powered and secured by ttechnos
          </p>
        </div>
      </footer>
    </div>
  );
};