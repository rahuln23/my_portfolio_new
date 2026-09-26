export default function Experience({ experience = {} }) {
  const list = Object.entries(experience);

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-label">04 / Experience</div>

        <h2 className="section-title">
          Where I've worked.
        </h2>

        <div style={{ marginTop: 55 }}>
          {list.map(([id, item], index) => (
            <div
              key={id}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "150px 1fr",
                gap: 30,
                padding: "28px 0",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 10,
                }}
              >
                {item.startDate} —{" "}
                {item.endDate || "Present"}
              </div>

              <div>
                <h3 style={{ fontSize: 20 }}>
                  {item.position}
                </h3>

                <div
                  style={{
                    color: "var(--purple)",
                    marginTop: 5,
                    fontSize: 11,
                  }}
                >
                  {item.company}
                </div>

                <p
                  style={{
                    marginTop: 15,
                    color: "var(--muted)",
                    fontSize: 12,
                    lineHeight: 1.8,
                    maxWidth: 700,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}