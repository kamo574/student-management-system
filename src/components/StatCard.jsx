export default function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <article className="stat-card">
      <div className={'stat-icon tone-' + tone} aria-hidden="true"><Icon size={19} strokeWidth={1.8} /></div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-note">{note}</p>
      </div>
    </article>
  )
}
