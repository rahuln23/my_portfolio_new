export default function Experience({ experience = {} }) {
const list = Object.entries(experience).sort(
  ([, first], [, second]) =>
    Number(first.order ?? 999999) -
    Number(second.order ?? 999999)
);

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-label">04 / Experience</div>

        <h2 className="section-title">
          Where I've worked.
        </h2>

        <div className="experience-list">
          {list.length === 0 ? (
            <div className="experience-empty">
              No experience added yet.
            </div>
          ) : (
            list.map(([id, item]) => (
              <div
                key={id}
                className="experience-item"
              >
                {/* Date */}
                <div className="experience-date">
                  {item.startDate} —{" \n"}
                  {item.endDate || "Present"}
                </div>

                {/* Details */}
                <div className="experience-details">
                  <h3>{item.position}</h3>

                  <div className="experience-company">
                    {item.company}
                  </div>

                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}