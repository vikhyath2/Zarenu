
import React from "react";
import "./Rv.css";

export const Rv = () => {
  return (
    <div className="zare-nu">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo-link">
            <img
              className="logo"
              alt="Zare Nu Logo"
              src="/img/logo-3.png"
            />
          </a>
          <nav className="nav-group">
            <a className="nav-link" href="/fo">Find Opportunities</a>
            <a className="nav-link active" href="/rv">Recruit Volunteer</a>
            <a className="nav-link" href="/about">About</a>
            <a className="nav-link" href="/login">Log In</a>
            <a className="donate-btn" href="/donate">❤️ Donate</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">Recruit Volunteers</h1>
        <p className="page-subtitle">
          Connect with passionate volunteers ready to make a difference in your organization
        </p>
      </section>

      {/* Main Content */}
      <main className="recruit-content">
        
        {/* Why Recruit Section */}
        <section className="section">
          <h2 className="section-title">Why Recruit Through Zare Nu?</h2>
          <div className="section-content">
            <p>
              Zare Nu connects your organization with dedicated volunteers who are passionate about making 
              a meaningful impact in Ethiopian communities. Our platform streamlines the recruitment process, 
              helping you find skilled volunteers who align with your mission and values.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2 className="section-title">Benefits for Organizations</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <span className="benefit-icon">🎯</span>
              <h3>Targeted Matching</h3>
              <p>
                Our smart matching system connects you with volunteers whose skills, 
                interests, and availability align perfectly with your project needs.
              </p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">⏰</span>
              <h3>Save Time</h3>
              <p>
                Streamlined recruitment process reduces time spent on screening and 
                administrative tasks, letting you focus on your mission.
              </p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">🌟</span>
              <h3>Quality Volunteers</h3>
              <p>
                Access pre-screened, motivated volunteers who are committed to 
                making a positive impact in their communities.
              </p>
            </div>
            <div className="benefit-card">
              <span className="benefit-icon">📊</span>
              <h3>Track Impact</h3>
              <p>
                Monitor volunteer hours, project progress, and community impact 
                through our comprehensive reporting tools.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="process-section">
          <h2 className="section-title">How It Works</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Post Your Opportunity</h3>
                <p>Create a detailed posting describing your volunteer opportunity, required skills, and time commitment.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Review Applications</h3>
                <p>Browse volunteer profiles and applications from interested candidates who match your criteria.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Connect & Collaborate</h3>
                <p>Interview and select volunteers, then collaborate to make a meaningful impact in your community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Organization Types Section */}
        <section className="org-types-section">
          <h2 className="section-title">Perfect for All Organization Types</h2>
          <div className="org-grid">
            <div className="org-card">
              <span className="org-icon">🏥</span>
              <h3>NGOs & Nonprofits</h3>
              <p>Expand your reach and amplify your impact with dedicated volunteer support.</p>
            </div>
            <div className="org-card">
              <span className="org-icon">🏫</span>
              <h3>Educational Institutions</h3>
              <p>Enhance learning programs with skilled volunteers and community mentors.</p>
            </div>
            <div className="org-card">
              <span className="org-icon">🏛️</span>
              <h3>Government Agencies</h3>
              <p>Strengthen community programs with volunteer support and engagement.</p>
            </div>
            <div className="org-card">
              <span className="org-icon">🏢</span>
              <h3>Corporate Programs</h3>
              <p>Build meaningful CSR initiatives with employee and community volunteers.</p>
            </div>
            <div className="org-card">
              <span className="org-icon">⛪</span>
              <h3>Religious Organizations</h3>
              <p>Mobilize your community for service projects and outreach programs.</p>
            </div>
            <div className="org-card">
              <span className="org-icon">🤝</span>
              <h3>Community Groups</h3>
              <p>Organize local initiatives with passionate neighborhood volunteers.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Volunteers?</h2>
            <p>Join hundreds of organizations already using Zare Nu to recruit passionate volunteers.</p>
            <div className="cta-buttons">
              <a href="/post-opportunity" className="cta-btn primary">Post an Opportunity</a>
              <a href="/organization-signup" className="cta-btn secondary">Register Your Organization</a>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="success-section">
          <h2 className="section-title">Success Stories</h2>
          <div className="success-grid">
            <div className="success-card">
              <div className="quote">"Zare Nu helped us find 15 volunteers for our education program in just 2 weeks. The quality of volunteers exceeded our expectations."</div>
              <div className="author">
                <strong>Name</strong>
                <span>Designation</span>
              </div>
            </div>
            <div className="success-card">
              <div className="quote">"The platform made it incredibly easy to connect with volunteers who truly understood our mission. Our community health project was a huge success."</div>
              <div className="author">
                <strong>Name</strong>
                <span>Designation</span>
              </div>
            </div>
            <div className="success-card">
              <div className="quote">"Thanks to Zare Nu, we were able to scale our environmental conservation project and reach 5 additional communities this year."</div>
              <div className="author">
                <strong>Name</strong>
                <span>Designation</span>
              </div>
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
