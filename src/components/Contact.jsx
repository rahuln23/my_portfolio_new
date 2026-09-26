export default function Contact({ contact = {} }) {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-label">05 / Contact</div>

        <h2 className="section-title">
          Let's build something.
        </h2>

        <p
          className="section-description"
          style={{ marginTop: 25 }}
        >
          {contact.description ||
            "Have an idea, project or opportunity? Drop me a message."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginTop: 50,
          }}
        >
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="glass"
              style={{
                padding: 22,
                borderRadius: 18,
              }}
            >
              <small
                style={{
                  color: "var(--muted)",
                  fontSize: 9,
                }}
              >
                EMAIL
              </small>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {contact.email}
              </div>
            </a>
          )}

          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="glass"
              style={{
                padding: 22,
                borderRadius: 18,
              }}
            >
              <small
                style={{
                  color: "var(--muted)",
                  fontSize: 9,
                }}
              >
                PHONE
              </small>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {contact.phone}
              </div>
            </a>
          )}

          {contact.location && (
            <div
              className="glass"
              style={{
                padding: 22,
                borderRadius: 18,
              }}
            >
              <small
                style={{
                  color: "var(--muted)",
                  fontSize: 9,
                }}
              >
                LOCATION
              </small>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {contact.location}
              </div>
            </div>
          )}
        </div>

        {contact.socials && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              marginTop: 35,
            }}
          >
            {Object.entries(contact.socials).map(
              ([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--muted)",
                    fontSize: 10,
                    textTransform: "uppercase",
                  }}
                >
                  {name} ↗
                </a>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}