import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, BookOpenCheck, CircleHelp, Clock3, GraduationCap, LayoutDashboard, Plus, UsersRound } from 'lucide-react'
import CampusIllustration from './components/CampusIllustration.jsx'
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx'
import StatCard from './components/StatCard.jsx'
import StudentDirectory from './components/StudentDirectory.jsx'
import StudentFormModal from './components/StudentFormModal.jsx'
import { addStudent, createStudentCsv, deleteStudent, loadStudents, makeStudentId, saveStudents, updateStudent } from './utils/studentUtils.js'

export default function App() {
  const [students, setStudents] = useState(loadStudents)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [notice, setNotice] = useState('')
  const [storageWarning, setStorageWarning] = useState(false)
  const year = new Date().getFullYear()

  useEffect(() => {
    if (!saveStudents(students)) setStorageWarning(true)
  }, [students])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const counts = useMemo(() => ({
    All: students.length,
    Enrolled: students.filter((student) => student.status === 'Enrolled').length,
    Pending: students.filter((student) => student.status === 'Pending').length,
    Inactive: students.filter((student) => student.status === 'Inactive').length,
  }), [students])
  const courseCount = useMemo(
    () => new Set(students.filter((student) => student.isActive).map((student) => student.course)).size,
    [students],
  )
  const visibleStudents = useMemo(() => {
    const term = query.trim().toLowerCase()
    return students.filter((student) => {
      const statusMatches = filter === 'All' || student.status === filter
      const fields = [student.name, student.id, student.email, student.course, student.status]
      const textMatches = !term || fields.some((value) => String(value).toLowerCase().includes(term))
      return statusMatches && textMatches
    })
  }, [students, query, filter])

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }
  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (student) => {
    setEditing(student)
    setFormOpen(true)
  }
  const saveRecord = (values) => {
    if (editing) {
      setStudents((current) => updateStudent(current, editing.id, values))
      setNotice(values.name + '’s record was updated.')
    } else {
      setStudents((current) => addStudent(current, values))
      setNotice(values.name + ' was added to the directory.')
    }
    closeForm()
  }
  const confirmDelete = () => {
    if (!deleting) return
    setStudents((current) => deleteStudent(current, deleting.id))
    setNotice(deleting.name + '’s record was deleted.')
    setDeleting(null)
  }
  const exportCsv = () => {
    const file = new Blob([createStudentCsv(students)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'campus-student-directory.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('The student directory was exported.')
  }

  return (
    <div className="app-shell" id="top">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Campus student management home">
          <span className="brand-mark"><GraduationCap size={21} /></span>
          <span className="brand-name"><strong>campus</strong><small>STUDENT MANAGEMENT</small></span>
        </a>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          <a href="#top" className="side-link"><LayoutDashboard size={17} /> Overview</a>
          <a href="#student-directory" className="side-link selected" aria-current="page"><UsersRound size={17} /> Students <span>{students.length}</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="year-card"><span><BookOpenCheck size={16} /></span><div><small>ACADEMIC YEAR</small><strong>{year}</strong></div></div>
          <p>A thoughtful space for every student.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="slash">/</span><strong>Students</strong></div>
          <div className="top-actions">
            <button className="help-link" type="button" onClick={() => setNotice('Tip: search by name, student ID, email, or course.')}>
              <CircleHelp size={16} /> Need a hand?
            </button>
            <span className="top-separator" />
            <div className="profile"><span>AO</span><div><strong>Academic office</strong><small>Administrator</small></div></div>
          </div>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div><p className="eyebrow">ACADEMIC YEAR {year}</p><h1>Student overview</h1><p>A little organization. A brighter future.</p></div>
            <button className="button button-primary heading-add" type="button" onClick={openAdd}><Plus size={16} /> Add student</button>
          </section>

          <section className="hero-card" aria-label="Welcome">
            <div className="hero-copy">
              <p className="hero-kicker"><span>✦</span> CONNECTED BY POSSIBILITY</p>
              <h2>Every student.<br />A new possibility.</h2>
              <p>Your student community, all in one place.</p>
              <a href="#student-directory">Explore directory <ArrowUpRight size={14} /></a>
            </div>
            <div className="hero-art"><CampusIllustration /></div>
            <span className="hero-ring ring-one" aria-hidden="true" /><span className="hero-ring ring-two" aria-hidden="true" />
          </section>

          <section className="stats-grid" aria-label="Student summary">
            <StatCard icon={UsersRound} label="Total students" value={String(students.length).padStart(2, '0')} note="In your student directory" tone="green" />
            <StatCard icon={GraduationCap} label="Enrolled students" value={String(counts.Enrolled).padStart(2, '0')} note={students.length ? Math.round(counts.Enrolled / students.length * 100) + '% of all students' : 'Ready for your first record'} tone="blue" />
            <StatCard icon={Clock3} label="Pending enrollment" value={String(counts.Pending).padStart(2, '0')} note="Awaiting confirmation" tone="amber" />
            <StatCard icon={BookOpenCheck} label="Active courses" value={String(courseCount).padStart(2, '0')} note="Across active students" tone="lavender" />
          </section>

          {storageWarning && <p className="storage-warning" role="status">Browser storage is unavailable, so changes may not remain after you leave this page.</p>}

          <StudentDirectory
            students={visibleStudents}
            total={students.length}
            filter={filter}
            counts={counts}
            query={query}
            onQuery={setQuery}
            onFilter={setFilter}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={setDeleting}
            onExport={exportCsv}
          />
          <footer className="page-footer"><span>© {year} Campus student management</span><span>Built for the next generation of learners</span></footer>
        </div>
      </main>

      {formOpen && <StudentFormModal key={editing ? editing.id : 'new'} student={editing} newId={editing?.id || makeStudentId(students, year)} onClose={closeForm} onSave={saveRecord} />}
      {deleting && <DeleteConfirmModal student={deleting} onClose={() => setDeleting(null)} onConfirm={confirmDelete} />}
      {notice && <div className="toast" role="status" aria-live="polite">{notice}</div>}
    </div>
  )
}
