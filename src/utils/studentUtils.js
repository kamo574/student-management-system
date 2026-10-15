import { initialStudents, STUDENT_STATUSES } from '../data/initialStudents.js'

export const STORAGE_KEY = 'campus-student-records-v1'

export const loadStudents = () => {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) return initialStudents
    const parsedStudents = JSON.parse(storedValue)
    return Array.isArray(parsedStudents) ? parsedStudents : initialStudents
  } catch {
    return initialStudents
  }
}

export const saveStudents = (students) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
    return true
  } catch {
    return false
  }
}

export const makeStudentId = (students, year = new Date().getFullYear()) => {
  let nextNumber = 1
  students.forEach((student) => {
    const parts = String(student.id).split('-')
    const number = Number(parts[parts.length - 1])
    if (Number.isInteger(number) && number >= nextNumber) nextNumber = number + 1
  })
  return 'STU-' + year + '-' + String(nextNumber).padStart(3, '0')
}

export const validateStudent = (form) => {
  const errors = {}
  const name = String(form.name || '').trim()
  const email = String(form.email || '').trim()
  const age = Number(form.age)

  if (!name) errors.name = 'Enter the student’s full name.'
  if (form.age === '' || !Number.isInteger(age) || age < 16 || age > 100) {
    errors.age = 'Age must be a whole number between 16 and 100.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (!form.course) errors.course = 'Choose a course of study.'
  if (!STUDENT_STATUSES.includes(form.status)) errors.status = 'Choose an enrollment status.'
  return errors
}

const normalizeStudent = (id, values) => ({
  id,
  name: String(values.name).trim(),
  age: Number(values.age),
  email: String(values.email).trim(),
  course: values.course,
  status: values.status,
  isActive: values.status !== 'Inactive',
})

export const addStudent = (students, values) => {
  const id = makeStudentId(students)
  return [normalizeStudent(id, values), ...students]
}

export const updateStudent = (students, id, values) =>
  students.map((student) => student.id === id ? normalizeStudent(id, values) : student)

export const deleteStudent = (students, id) =>
  students.filter((student) => student.id !== id)

export const getInitials = (name) =>
  String(name).trim().split(/\s+/).map((part) => part.charAt(0)).slice(0, 2).join('').toUpperCase()

const csvCell = (value) => '"' + String(value).replace(/"/g, '""') + '"'

export const createStudentCsv = (students) => {
  const header = ['Student ID', 'Full name', 'Age', 'Email', 'Course of study', 'Enrollment status']
  const rows = students.map((student) =>
    [student.id, student.name, student.age, student.email, student.course, student.status]
      .map(csvCell)
      .join(','),
  )
  return [header.map(csvCell).join(','), ...rows].join('\n')
}
