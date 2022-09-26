import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'

export function useToast() {
  const { showToast } = useContext(ToastContext)

  return { showToast }
}
