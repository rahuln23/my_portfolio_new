export default function Projects({ projects = {} }) {
  const list = Object.entries(projects);

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-label">03 / Selected Work</div>

        <h2 className="section-title">
          Things I've built.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginTop: 50,
          }}
        >
          {list.map(([id, project]) => (
            <article
              key={id}
              className="glass"
              style={{
                overflow: "hidden",
                borderRadius: 22,
              }}
            >
              {project.imageUrl && (
                <div
                  style={{
                    aspectRatio: "16 / 9",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(1)",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: 24 }}>
                <div
                  style={{
                    color: "var(--purple)",
                    fontSize: 10,
                    marginBottom: 12,
                  }}
                >
                  {project.category || "PROJECT"}
                </div>

                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {project.title}
                </h3>

                <p
                  style={{
                    marginTop: 12,
                    color: "var(--muted)",
                    fontSize: 12,
                    lineHeight: 1.7,
                  }}
                >
                  {project.description}
                </p>

                {project.technologies && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 20,
                    }}
                  >
                    {project.technologies.map(
                      (technology) => (
                        <span
                          key={technology}
                          style={{
                            padding: "5px 8px",
                            border: "1px solid var(--border)",
                            borderRadius: 999,
                            color: "var(--muted)",
                            fontSize: 9,
                          }}
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 22,
                      color: "white",
                      fontSize: 10,
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                    }}
                  >
                    View Project ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}