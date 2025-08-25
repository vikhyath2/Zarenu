import React, { useState } from "react";
import "./Fo.css";

export const Fo = () => {
  const [selectedType, setSelectedType] = useState("in-person");
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    greatFor: [],
    timeFrame: [],
    distance: ""
  });
  
  // Popup states
  const [showCausesPopup, setShowCausesPopup] = useState(false);
  const [showSkillsPopup, setShowSkillsPopup] = useState(false);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);

  const handleCauseChange = (cause) => {
    setSelectedCauses(prev => 
      prev.includes(cause) 
        ? prev.filter(c => c !== cause)
        : [...prev, cause]
    );
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleFilterChange = (category, value) => {
    if (category === 'distance') {
      setSelectedFilters(prev => ({ ...prev, distance: value }));
    } else {
      setSelectedFilters(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(v => v !== value)
          : [...prev[category], value]
      }));
    }
  };

  const clearAllFilters = () => {
    setSelectedCauses([]);
    setSelectedSkills([]);
    setSelectedFilters({ greatFor: [], timeFrame: [], distance: "" });
  };

  const causes = [
    "🎭 Advocacy & Human Rights",
    "🐕 Animals",
    "🎨 Arts & Culture",
    "📊 Board Development",
    "👶 Children & Youth",
    "🏘️ Community",
    "💻 Computers & Technology",
    "🆘 Crisis Support",
    "📚 Education & Literacy",
    "💼 Employment",
    "🌿 Environment",
    "🏥 Health & Medicine",
    "🏠 Homeless & Housing",
    "👨‍👩‍👧‍👦 Immigrants & Refugees",
    "⚖️ Justice & Legal",
    "📺 Media & Broadcasting",
    "♿ People with Disabilities",
    "🏛️ Politics"
  ];

  const skills = [
    "Academics",
    "Administrative",
    "Animals & Environment",
    "Arts",
    "Business & Management",
    "Children & Family",
    "Disaster Relief",
    "Education & Literacy",
    "For Profit & Nonprofit Development",
    "Healthcare & Social Services",
    "IT Infrastructure & Software",
    "Language & Culture",
    "Legal & Advocacy",
    "Marketing & Communications",
    "Music",
    "Sports & Recreation"
  ];

  const opportunities = [
    {
      icon: "🌱",
      title: "Environment & Agriculture",
      description: "Join conservation projects, sustainable farming initiatives, and environmental protection programs across Ethiopia.",
      location: "Locations",
      time: "Schedule",
      projects: "active projects"
    },
    {
      icon: "🏗️",
      title: "Infrastructure & Housing",
      description: "Help build homes, schools, and community centers. Support infrastructure development in underserved communities.",
      location: "location",
      time: "schedule",
      projects: "active projects"
    },
    {
      icon: "📚",
      title: "Education & Youth Empowerment",
      description: "Teach, mentor, and empower young people through educational programs and skill development initiatives.",
      location: "location",
      time: "schedule",
      projects: "active projects"
    },
    {
      icon: "🏥",
      title: "Health & Medical Outreach",
      description: "Support healthcare initiatives, medical camps, and public health education programs in underserved areas.",
      location: "location",
      time: "schedule",
      projects: "active projects"
    },
    {
      icon: "🛡️",
      title: "Refugee & Crisis Response",
      description: "Provide critical support to refugees and displaced communities through emergency response and integration programs.",
      location: "location",
      time: "shedule",
      projects: "active projects"
    },
    {
      icon: "💻",
      title: "Business, Tech & Media Skills",
      description: "Share your professional expertise in technology, business development, marketing, and digital media.",
      location: "location",
      time: "schedule",
      projects: "active projects"
    }
  ];

  const featuredOpportunities = [
    {
      badge: "🌟 Urgent",
      title: "Emergency Education Support - Tigray Region",
      description: "Help restore educational services in post-conflict areas. Teaching experience preferred.",
      meta: ["📅 Starts: date", "📍 Tigray, Ethiopia", "⏰ duration"]
    },
    {
      badge: "💡 New",
      title: "Digital Literacy Program Coordinator",
      description: "Lead technology training programs for rural communities. IT background required.",
      meta: ["📅 Starts: date", "📍 Locations", "⏰ duration"]
    },
    {
      badge: "❤️ Popular",
      title: "Community Health Worker Training",
      description: "Train local health workers in rural communities. Medical background preferred.",
      meta: ["📅 date", "📍 Locations", "⏰ duration"]
    }
  ];

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
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              width: '76px',
              height: '76px',
              backgroundColor: '#f70707',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'white',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              ZARE NU
            </div>
          </a>
          <nav className="nav-group">
            <a className="nav-link active" href="/fo">Find Opportunities</a>
            <a className="nav-link" href="/rv">Recruit Volunteer</a>
            <a className="nav-link" href="/about">About</a>
            <a className="nav-link" href="/login">Log In</a>
            <a className="donate-btn" href="/donate">❤️ Donate</a>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">Find Opportunities</h1>
        <p className="page-subtitle">
          Discover meaningful volunteer opportunities that match your skills and passion in Ethiopia
        </p>
      </section>
      
      {/* Advanced Filter Section */}
      <section className="advanced-filter-section">
        <div className="filter-container">
          <div className="filter-header">
            <div className="filter-type-buttons">
              <label className="filter-type">
                <input 
                  type="radio" 
                  name="type" 
                  value="in-person"
                  checked={selectedType === "in-person"}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <span>In-Person</span>
              </label>
              <label className="filter-type">
                <input 
                  type="radio" 
                  name="type" 
                  value="virtual"
                  checked={selectedType === "virtual"}
                  onChange={(e) => setSelectedType(e.target.value)}
                />
                <span>Virtual</span>
              </label>
            </div>
            <button 
              onClick={clearAllFilters}
              className="clear-filters"
            >
              CLEAR ALL FILTERS
            </button>
          </div>

          <div className="filter-controls">
            <div className="filter-row">
              <input 
                type="text" 
                placeholder="Location" 
                className="location-input"
              />
              
              <div className="dropdown-wrapper">
                <button 
                  className="filter-dropdown"
                  onClick={() => setShowCausesPopup(true)}
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  {selectedCauses.length > 0 ? `${selectedCauses.length} Causes Selected` : 'Cause Areas ▼'}
                </button>
              </div>
              
              <div className="dropdown-wrapper">
                <button 
                  className="filter-dropdown"
                  onClick={() => setShowSkillsPopup(true)}
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  {selectedSkills.length > 0 ? `${selectedSkills.length} Skills Selected` : 'Skills ▼'}
                </button>
              </div>
              
              {/* <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="search-filter"
                />
                <button className="search-filter-btn">🔍</button>
              </div> */}
              
              <div className="dropdown-wrapper">
                <button 
                  className="filter-dropdown"
                  onClick={() => setShowFiltersPopup(true)}
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  More Filters ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Causes Popup */}
      {showCausesPopup && (
        <div className="popup-overlay" onClick={() => setShowCausesPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Select Your Causes</h3>
              <button className="popup-close" onClick={() => setShowCausesPopup(false)}>×</button>
            </div>
            <div className="causes-grid">
              {causes.map((cause, index) => (
                <label key={index} className="cause-item">
                  <input 
                    type="checkbox"
                    checked={selectedCauses.includes(cause)}
                    onChange={() => handleCauseChange(cause)}
                  />
                  <span>{cause}</span>
                </label>
              ))}
            </div>
            <div className="popup-actions">
              <button className="clear-all-btn" onClick={() => setSelectedCauses([])}>
                Clear All
              </button>
              <button className="save-btn" onClick={() => setShowCausesPopup(false)}>
                Apply ({selectedCauses.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Popup */}
      {showSkillsPopup && (
        <div className="popup-overlay" onClick={() => setShowSkillsPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Select Your Skills</h3>
              <button className="popup-close" onClick={() => setShowSkillsPopup(false)}>×</button>
            </div>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <label key={index} className="skill-item">
                  <input 
                    type="checkbox"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
            <div className="popup-actions">
              <button className="clear-all-btn" onClick={() => setSelectedSkills([])}>
                Clear All
              </button>
              <button className="save-btn" onClick={() => setShowSkillsPopup(false)}>
                Apply ({selectedSkills.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Filters Popup */}
      {showFiltersPopup && (
        <div className="popup-overlay" onClick={() => setShowFiltersPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>More Filters</h3>
              <button className="popup-close" onClick={() => setShowFiltersPopup(false)}>×</button>
            </div>

            <div className="filter-group">
              <label className="filter-label">Distance</label>
              <input 
                type="text" 
                placeholder="Enter distance (e.g., 50 miles)"
                className="distance-input"
                value={selectedFilters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Great For</label>
              <div className="checkbox-group">
                {["Kids", "Teens", "Seniors", "Groups"].map((item, index) => (
                  <label key={index} className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={selectedFilters.greatFor.includes(item)}
                      onChange={() => handleFilterChange('greatFor', item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Time Frame</label>
              <div className="checkbox-group">
                {["Daytime", "Weekdays", "Evenings (after 5pm)", "Weekends"].map((item, index) => (
                  <label key={index} className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={selectedFilters.greatFor.includes(item)}
                      onChange={() => handleFilterChange('greatFor', item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>


            {/* <div className="filter-group">
              <label className="filter-label">Time Frame</label>
              <div className="time-options">
                <div className="time-column">
                  <span className="time-label">Daytime</span>
                  <span className="time-label">Evenings (after 5pm)</span>
                </div>
                <div className="time-column">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={selectedFilters.timeFrame.includes('Weekdays')}
                      onChange={() => handleFilterChange('timeFrame', 'Weekdays')}
                    />
                    <span>Weekdays</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox"
                      checked={selectedFilters.timeFrame.includes('Weekends')}
                      onChange={() => handleFilterChange('timeFrame', 'Weekends')}
                    />
                    <span>Weekends</span>
                  </label>
                </div>
              </div>
            </div> */}

            <div className="popup-actions">
              <button 
                onClick={() => setSelectedFilters({ greatFor: [], timeFrame: [], distance: "" })}
                className="clear-all-btn"
              >
                Clear All
              </button>
              <button className="save-btn" onClick={() => setShowFiltersPopup(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Grid Section */}
      <section className="opportunities-section">
        <div className="opportunities-content">
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
            Available Opportunities
          </h2>
          <div className="opportunities-grid">
            {opportunities.map((opportunity, index) => (
              <a
                key={index}
                className="opportunity-card"
                href="#"
              >
                <span className="card-icon">{opportunity.icon}</span>
                <h3 className="card-title">{opportunity.title}</h3>
                <p className="card-description">{opportunity.description}</p>
                <div className="card-meta">
                  <span className="meta-item">📍 {opportunity.location}</span>
                  <span className="meta-item">⏰ {opportunity.time}</span>
                </div>
                <div className="card-stats">{opportunity.projects}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      <section className="featured-section">
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px' }}>
          Featured Opportunities
        </h2>
        <div className="featured-grid">
          {featuredOpportunities.map((featured, index) => (
            <div key={index} className="featured-card">
              <div className="featured-badge">{featured.badge}</div>
              <h3>{featured.title}</h3>
              <p>{featured.description}</p>
              <div className="featured-meta">
                {featured.meta.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
              </div>
              <a href="#" className="featured-btn">Apply Now</a>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Can't Find What You're Looking For?</h2>
          <p>
            We're always adding new opportunities. Contact us to discuss custom volunteer placements that match your specific skills and interests.
          </p>
          <div className="cta-buttons">
            <a href="#" className="cta-btn primary">Request Custom Opportunity</a>
            <a href="#" className="cta-btn secondary">Contact Our Team</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container">
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

        <div className="footer-legal">
          <p>
            <a href="#" target="_blank" rel="noopener noreferrer">TERMS & CONDITIONS</a> | 
            <a href="#" target="_blank" rel="noopener noreferrer"> PRIVACY POLICY</a> | 
            ACCESSIBILITY STATEMENT<br />
            Powered and secured by ttechnos
          </p>
        </div>
      </footer>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .popup-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .popup-header h3 {
          color: #f70707;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }

        .popup-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .popup-close:hover {
          background: #f0f0f0;
          color: #f70707;
        }

        .popup-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .filter-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          gap: 15px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .filter-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .popup-content {
            margin: 10px;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};