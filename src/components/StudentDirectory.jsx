import { Download, Search, UserRoundPlus } from 'lucide-react'
import { getInitials } from '../utils/studentUtils.js'

const statusClass = {
  Enrolled: 'status-enrolled',
  Pending: 'status-pending',
  Inactive: 'status-inactive',
}
const filters = [
  { label: 'All students', value: 'All' },
  { label: 'Enrolled', value: 'Enrolled' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Inactive', value: 'Inactive' },
]

export default function StudentDirectory({
  students, total, filter, counts, query, onQuery, onFilter,
  onAdd, onEdit, onDelete, onExport,
}) {
  return (
    <section className="directory-panel" id="student-directory" aria-labelledby="directory-title">
      <div className="directory-heading">
        <div>
          <p className="section-eyebrow">YOUR COMMUNITY</p>
          <h2 id="directory-title">Student directory</h2>
          <p className="directory-subtitle">
            {students.length === total ? 'A clear view of every student in your workspace.' : 'Showing ' + students.length + ' of ' + total + ' students.'}
          </p>
        </div>
        <div className="directory-actions">
          <button className="button button-outline" type="button" onClick={onExport} disabled={total === 0}><Download size={15} /> Export directory</button>
          <button className="button button-primary" type="button" onClick={onAdd}><UserRoundPlus size={15} /> Add student</button>
        </div>
      </div>
      <div className="directory-toolbar">
        <div className="filter-tabs" role="group" aria-label="Filter students by enrollment status">
          {filters.map((item) => (
            <button key={item.value} className={'filter-tab' + (filter === item.value ? ' active' : '')} type="button" aria-pressed={filter === item.value} onClick={() => onFilter(item.value)}>
              {item.label}<span>{counts[item.value]}</span>
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={16} aria-hidden="true" />
          <span className="visually-hidden">Search students</span>
          <input type="search" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search name, ID, course..." />
        </label>
      </div>
      {students.length ? (
        <div className="table-wrap">
          <table className="student-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Student ID</th><th scope="col">Age</th><th scope="col">Course of study</th><th scope="col">Status</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td data-label="Student">
                    <div className="student-identity">
                      <span className={'student-avatar avatar-' + (index % 4)} aria-hidden="true">{getInitials(student.name)}</span>
                      <span className="student-name-block"><strong>{student.name}</strong><small>{student.email}</small></span>
                    </div>
                  </td>
                  <td data-label="Student ID"><span className="student-id">{student.id}</span></td>
                  <td data-label="Age">{student.age}</td>
                  <td data-label="Course of study"><span className="course-name">{student.course}</span></td>
                  <td data-label="Status"><span className={'status-badge ' + statusClass[student.status]}><span className="status-dot" aria-hidden="true" />{student.status}</span></td>
                  <td data-label="Actions"><div className="row-actions">
                    <button className="row-action" type="button" aria-label={'Edit ' + student.name} onClick={() => onEdit(student)}>Edit</button>
                    <button className="row-action danger-text" type="button" aria-label={'Delete ' + student.name} onClick={() => onDelete(student)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Search size={21} /></div>
          <h3>{total === 0 ? 'No student records yet' : 'No students found'}</h3>
          <p>{total === 0 ? 'Add your first student to start building the directory.' : 'Try another search or choose a different status filter.'}</p>
          {total === 0 && <button className="button button-primary" type="button" onClick={onAdd}><UserRoundPlus size={15} /> Add first student</button>}
        </div>
      )}
      <div className="directory-footer">
        <span>{students.length === total ? 'Showing all ' + total + ' student records' : 'Showing ' + students.length + ' matching records'}</span>
        <span>Records save automatically in this browser</span>
      </div>
    </section>
  )
}
