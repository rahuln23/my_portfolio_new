export default function Skills({ skills = {} }) {
  const list = Object.values(skills);

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-label">02 / Skills</div>

        <h2 className="section-title">
          Tools of the trade.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            marginTop: 50,
          }}
        >
          {list.map((skill, index) => (
            <div
              key={skill.id || index}
              className="glass"
              style={{
                padding: 24,
                borderRadius: 18,
                minHeight: 130,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {skill.name}
              </div>

              {skill.category && (
                <div
                  style={{
                    marginTop: 10,
                    color: "var(--purple)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {skill.category}
                </div>
              )}

              {skill.description && (
                <p
                  style={{
                    marginTop: 14,
                    color: "var(--muted)",
                    fontSize: 11,
                    lineHeight: 1.7,
                  }}
                >
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}