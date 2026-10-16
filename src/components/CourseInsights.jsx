export default function CourseInsights({ courses, total }) {
  return (
    <section className="insights-panel" aria-labelledby="insights-title">
      <div className="insights-heading">
        <div>
          <p className="section-eyebrow">DASHBOARD INSIGHTS</p>
          <h2 id="insights-title">Course distribution</h2>
          <p>See how the student directory is spread across courses of study.</p>
        </div>
        <div className="insights-total"><strong>{total}</strong><span>student records</span></div>
      </div>
      <div className="course-progress-grid">
        {courses.map((item) => (
          <article className="course-progress" key={item.course}>
            <div className="course-progress-heading"><strong>{item.course}</strong><span>{item.count} student{item.count === 1 ? '' : 's'}</span></div>
            <div className="progress-track" role="progressbar" aria-label={item.course + ' enrollment'} aria-valuemin="0" aria-valuemax={total} aria-valuenow={item.count}>
              <span style={{ width: item.percentage + '%' }} />
            </div>
            <small>{item.percentage}% of the directory</small>
          </article>
        ))}
      </div>
    </section>
  )
}
