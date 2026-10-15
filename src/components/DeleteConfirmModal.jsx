import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteConfirmModal({ student, onClose, onConfirm }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  if (!student) return null
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-card delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="delete-icon" aria-hidden="true"><AlertTriangle size={22} /></div>
        <button className="icon-button delete-close" type="button" onClick={onClose} aria-label="Close confirmation"><X size={18} /></button>
        <h2 id="delete-title">Delete student record?</h2>
        <p>This removes <strong>{student.name}</strong> ({student.id}) from this browser’s directory. This action cannot be undone.</p>
        <div className="modal-actions">
          <button ref={cancelRef} className="button button-quiet" type="button" onClick={onClose}>Keep record</button>
          <button className="button button-danger" type="button" onClick={onConfirm}>Delete record</button>
        </div>
      </section>
    </div>
  )
}
