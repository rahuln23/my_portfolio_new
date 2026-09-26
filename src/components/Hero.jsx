import "./hero.css";

export default function Hero({ profile = {}, about = {} }) {
  const status = profile.status || "Available for Work";

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-status">
          <span className="status-dot" />
          {status}
        </div>

        <p className="hero-greeting">
          {profile.greeting || "Hi, I'm"}
        </p>

        <h1 className="hero-name glow-text">
          {profile.name || "Your Name"}
        </h1>

        <div className="hero-role">
          <span>{profile.position || "Creative Developer"}</span>
        </div>

        <p className="hero-description">
          {profile.shortBio ||
            about.description ||
            "I build digital experiences with code, design and a little bit of chaos."}
        </p>

        <div className="hero-actions">
          <a href="#projects" className="hero-primary">
            Explore Work
            <span>↗</span>
          </a>

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hero-secondary"
            >
              Resume
              <span>↓</span>
            </a>
          )}
        </div>

        <div className="hero-stats">
          <div>
            <strong>
              {profile.yearsExperience || "5"}+
            </strong>
            <span>Years Experience</span>
          </div>

          <div>
            <strong>
              {profile.projectsCompleted || "50"}+
            </strong>
            <span>Projects Completed</span>
          </div>

          <div>
            <strong>
              {profile.currentRole || "Developer"}
            </strong>
            <span>Current Role</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll to explore</span>
        <i />
      </div>
    </section>
  );
}