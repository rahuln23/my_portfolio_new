export default function About({ about = {} }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-label">01 / About</div>

        <h2 className="section-title">
          {about.title || "Building things that matter."}
        </h2>

        <div
          style={{
            marginTop: 30,
            maxWidth: 800,
            color: "var(--muted)",
            lineHeight: 1.9,
            fontSize: 15,
          }}
        >
          {about.description ||
            "I'm a developer focused on building modern digital products, solving complex problems and creating experiences people enjoy using."}
        </div>

        {about.highlights?.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 50,
            }}
          >
            {about.highlights.map((item, index) => (
              <div
                key={index}
                className="glass"
                style={{
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    color: "var(--purple)",
                    fontSize: 11,
                    marginBottom: 8,
                  }}
                >
                  {item.label}
                </div>

                <div style={{ fontSize: 14 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}