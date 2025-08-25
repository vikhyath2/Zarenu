import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonDanger } from "../../components/ButtonDanger";
import { SearchBar } from "../../components/SearchBar";
import { Icon137 } from "../../icons/Icon137";
import { Search } from "../../icons/Search";
import { submitContactForm } from '../../lib/api'
import "./style.css";

export const ZareNu = () => {
 
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Move these state hooks INSIDE the component
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  // Move these handler functions INSIDE the component
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Debug logs
    console.log("🚀 Form submit function called!");
    console.log("📝 Form data:", formData);
  
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: "Please fill in all required fields"
      });
      return;
    }
  
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
  
    try {
      // Call Django API instead of localStorage
      const response = await submitContactForm(formData);
      
      // Show success
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
  
      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
  
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error.message || "Error submitting form. Please try again."
      });
    }
  };

  // Define volunteer opportunity categories and their keywords
  const opportunityCategories = {
    "ENVIRONMENT & AGRICULTURE": ["environment", "agriculture", "farming", "green", "climate", "sustainability", "eco", "nature"],
    "INFRASTRUCTURE & HOUSING": ["infrastructure", "housing", "construction", "building", "shelter", "development", "urban"],
    "PARTNER WITH COMPANIES": ["corporate", "business", "company", "partnership", "sponsor", "collaboration"],
    "EDUCATION & YOUTH EMPOWERMENT": ["education", "youth", "teaching", "school", "learning", "student", "empowerment", "children"],
    "REFUGEE & CRISIS RESPONSE": ["refugee", "crisis", "emergency", "humanitarian", "relief", "disaster", "aid"],
    "SPONSORSHIP & IMPACT PARTNERSHIPS": ["sponsorship", "impact", "partnership", "funding", "support", "finance"],
    "BUSINESS, TECH & MEDIA SKILLS": ["business", "tech", "technology", "media", "skills", "digital", "IT", "computer"],
    "CORPORATE VOLUNTEERING & CSR": ["corporate", "CSR", "volunteering", "social responsibility", "company"],
    "HEALTH & MEDICAL OUTREACH": ["health", "medical", "healthcare", "doctor", "nurse", "clinic", "hospital", "medicine"],
    "DISABILITY INCLUSION & SPECIAL NEEDS": ["disability", "inclusion", "special needs", "accessibility", "support", "care"],
    "PRO-BONO SERVICES": ["pro-bono", "legal", "professional", "services", "consultation", "advice"],
    "TEAM VOLUNTEER EXPERIENCES": ["team", "group", "experience", "collaborative", "together"],
    "TARGETED VOLUNTEER OUTREACH": ["outreach", "community", "targeted", "local", "neighborhood"]
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim()) {
      // Convert query to lowercase for case-insensitive matching
      const searchTerm = query.toLowerCase().trim();

      // Find matching categories
      const matchingCategories = Object.entries(opportunityCategories).filter(([category, keywords]) =>
        keywords.some(keyword =>
          keyword.includes(searchTerm) || searchTerm.includes(keyword)
        ) || category.toLowerCase().includes(searchTerm)
      );

      // Navigate to find opportunities page with search parameters
      const searchParams = new URLSearchParams();
      searchParams.set('search', query);

      if (matchingCategories.length > 0) {
        searchParams.set('categories', matchingCategories.map(([category]) => category).join(','));
      }

      navigate(`/fo?${searchParams.toString()}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleCategoryClick = (category) => {
    // Navigate to find opportunities with the specific category selected
    const searchParams = new URLSearchParams();
    searchParams.set('category', category);
    navigate(`/fo?${searchParams.toString()}`);
  };

  return (
    <div className="zare-nu">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <img className="logo" alt="Logo" src="/img/logo-3.png" />

          <nav className="nav-group">
            <a className="nav-link" href="/fo">Find Opportunities</a>
            <a className="nav-link" href="/rv">Recruit Volunteer</a>
            <a className="nav-link active" href="/about">About</a>
            <a className="nav-link" href="/login">Log In</a>
            <a className="donate-btn" href="/donate">❤️ Donate</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="highlight">E</span>mpowering Volunteers
        </h1>

        {/* Enhanced Search */}
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search volunteer opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="explore-text">
          <h2 className="explore-title">
            Explore the most suitable volunteer opportunities in
            <span className="highlight"> Ethiopia</span>
          </h2>
        </div>

        {/* Opportunity Grid */}
        <div className="opportunity-grid">
          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("ENVIRONMENT & AGRICULTURE")}
          >
            <span className="card-icon">🌱</span>
            ENVIRONMENT & AGRICULTURE
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("INFRASTRUCTURE & HOUSING")}
          >
            <span className="card-icon">🏗️</span>
            INFRASTRUCTURE & HOUSING
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("PARTNER WITH COMPANIES")}
          >
            <span className="card-icon">🤝</span>
            PARTNER WITH COMPANIES
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("EDUCATION & YOUTH EMPOWERMENT")}
          >
            <span className="card-icon">📚</span>
            EDUCATION & YOUTH EMPOWERMENT
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("REFUGEE & CRISIS RESPONSE")}
          >
            <span className="card-icon">🆘</span>
            REFUGEE & CRISIS RESPONSE
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("SPONSORSHIP & IMPACT PARTNERSHIPS")}
          >
            <span className="card-icon">💝</span>
            SPONSORSHIP & IMPACT PARTNERSHIPS
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("BUSINESS, TECH & MEDIA SKILLS")}
          >
            <span className="card-icon">💻</span>
            BUSINESS, TECH & MEDIA SKILLS
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("CORPORATE VOLUNTEERING & CSR")}
          >
            <span className="card-icon">🏢</span>
            CORPORATE VOLUNTEERING & CSR
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("HEALTH & MEDICAL OUTREACH")}
          >
            <span className="card-icon">🏥</span>
            HEALTH & MEDICAL OUTREACH
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("DISABILITY INCLUSION & SPECIAL NEEDS")}
          >
            <span className="card-icon">♿</span>
            DISABILITY INCLUSION & SPECIAL NEEDS
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("PRO-BONO SERVICES")}
          >
            <span className="card-icon">⚖️</span>
            PRO-BONO SERVICES
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("TEAM VOLUNTEER EXPERIENCES")}
          >
            <span className="card-icon">👥</span>
            TEAM VOLUNTEER EXPERIENCES
          </button>

          <button
            className="opportunity-card"
            onClick={() => handleCategoryClick("TARGETED VOLUNTEER OUTREACH")}
          >
            <span className="card-icon">🎯</span>
            TARGETED VOLUNTEER OUTREACH
          </button>
        </div>
      </main>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="service-card">
            <h3 className="service-title">Services</h3>
            <div className="service-content">
              Comprehensive volunteer services and support
            </div>
          </div>

          <div className="service-card">
            <h3 className="service-title">Materials for Learning</h3>
            <div className="service-content">
              Educational resources and learning materials
            </div>
          </div>

          <div className="service-card">
            <h3 className="service-title">Volunteer</h3>
            <div className="service-content">
              Join our community of dedicated volunteers
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-main">
          {/* Company Info */}
          <div className="company-info">
            <h2>Contact</h2>
            <p>Feel free to contact us with any questions.</p>
            <div className="contact-details">
              <strong>Email:</strong> ttechnosllc@gmail.com<br />
              <strong>Phone:</strong> (555) 555-5555<br /><br />
              <strong>Zare Nu</strong><br />
              123 St address<br />
              Ethiopia
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            {/* Success Message */}
            {formStatus.isSubmitted && (
              <div className="form-success-message">
                <div className="success-icon">✅</div>
                <h3>Thank you for your message!</h3>
                <p>We've received your inquiry and will get back to you within 24 hours.</p>
              </div>
            )}

            {/* Error Message */}
            {formStatus.error && (
              <div className="form-error-message">
                <div className="error-icon">❌</div>
                <p>{formStatus.error}</p>
              </div>
            )}

            {!formStatus.isSubmitted && (
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Name <span className="required">*</span>
                  </label>
                  <div className="name-fields-container">
                    <div className="field-container">
                      <span className="field-label">First Name</span>
                      <input
                        type="text"
                        name="firstName"
                        className="form-input"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={formStatus.isSubmitting}
                        required
                      />
                    </div>
                    <div className="field-container">
                      <span className="field-label">Last Name</span>
                      <input
                        type="text"
                        name="lastName"
                        className="form-input"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={formStatus.isSubmitting}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={formStatus.isSubmitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={formStatus.isSubmitting}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={formStatus.isSubmitting}
                >
                  {formStatus.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div> 

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Projects</h4>
              <a href="https://cone-emu-wzrz.squarespace.com/materials-for-learning" target="_blank" rel="noopener noreferrer">
                Materials for Learning
              </a>
              <Link to="/services">Services Volunteers</Link>
            </div>

            <div className="footer-column">
              <h4>Find Opportunity</h4>
              <Link to="/fo">Education</Link>
              <Link to="/fo">Sports Advocate</Link>
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
          </div>
        </div>

        {/* Footer Legal */}
        <div className="footer-legal">
          <p>
            <a href="#terms">TERMS & CONDITIONS</a> |{" "}
            <a href="#privacy">PRIVACY POLICY</a> |{" "}
            ACCESSIBILITY STATEMENT<br />
            Powered and secured by ttechnos
          </p>
        </div>
      </footer>
    </div>
  );
};