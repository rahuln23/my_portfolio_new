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
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 40,
  }}
>
  {list.map((skill, index) => (
    <div
      key={skill.id || index}
      className="glass"
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        width: "fit-content",
        minWidth: 100,
        maxWidth: 260,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {skill.name}
      </div>

      {skill.category && (
        <div
          style={{
            marginTop: 6,
            color: "var(--purple)",
            fontSize: 9,
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
            marginTop: 8,
            color: "var(--muted)",
            fontSize: 10,
            lineHeight: 1.5,
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