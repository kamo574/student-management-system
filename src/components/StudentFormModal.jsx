import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { COURSE_OPTIONS, STUDENT_STATUSES } from '../data/initialStudents.js'
import { validateStudent } from '../utils/studentUtils.js'

const createInitialForm = (student, newId) => ({
  id: student?.id || newId,
  name: student?.name || '',
  age: student ? String(student.age) : '',
  email: student?.email || '',
  course: student?.course || '',
  status: student?.status || 'Enrolled',
})

export default function StudentFormModal({ student, students, newId, onClose, onSave }) {
  // The same modal receives either an existing record or a generated ID for a new one.
  const [form, setForm] = useState(() => createInitialForm(student, newId))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const nameRef = useRef(null)

  // Focus, Escape support, and scroll locking make the dialog accessible and usable.
  useEffect(() => {
    nameRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  // A controlled field keeps the current form value in React state.
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  // preventDefault stops a page refresh so validation feedback remains visible.
  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateStudent(form, students, student?.id)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setFormError('Please check the highlighted fields.')
      return
    }
    onSave({ ...form, age: Number(form.age) })
  }

  const editing = Boolean(student)
  const field = (name, label, control) => (
    <div className={'form-field' + (name === 'email' || name === 'id' ? ' form-field-full' : '')}>
      <label htmlFor={'student-' + name}>{label} {name !== 'id' && <span aria-hidden="true">*</span>}</label>
      {control}
      {errors[name] && <span className="field-error" id={name + '-error'}>{errors[name]}</span>}
    </div>
  )

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="student-form-title">
        <div className="modal-heading">
          <div>
            <p className="modal-eyebrow">{editing ? 'UPDATE RECORD' : 'NEW RECORD'}</p>
            <h2 id="student-form-title">{editing ? 'Edit student' : 'Add a student'}</h2>
            <p>{editing ? 'Make changes to this student’s academic record.' : 'Add the student details below.'}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form"><X size={19} /></button>
        </div>
        <form className="student-form" onSubmit={handleSubmit} noValidate>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="form-grid">
            {field('id', 'Student ID',
              <><input id="student-id" value={form.id} readOnly /><span className="field-hint">Generated for this record</span></>)}
            {field('name', 'Full name',
              <input ref={nameRef} id="student-name" name="name" value={form.name} onChange={handleChange} autoComplete="name" placeholder="e.g. Lerato Mokoena" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />)}
            {field('age', 'Age',
              <input id="student-age" name="age" type="number" min="16" max="100" step="1" value={form.age} onChange={handleChange} placeholder="e.g. 21" aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? 'age-error' : undefined} />)}
            {field('email', 'Email address',
              <input id="student-email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" placeholder="student@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />)}
            {field('course', 'Course of study',
              <select id="student-course" name="course" value={form.course} onChange={handleChange} aria-invalid={Boolean(errors.course)} aria-describedby={errors.course ? 'course-error' : undefined}>
                <option value="">Choose a course</option>
                {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
              </select>)}
            {field('status', 'Enrollment status',
              <select id="student-status" name="status" value={form.status} onChange={handleChange} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? 'status-error' : undefined}>
                {STUDENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>)}
          </div>
          <div className="modal-actions">
            <button className="button button-quiet" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit">{editing ? 'Save changes' : 'Add student'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
