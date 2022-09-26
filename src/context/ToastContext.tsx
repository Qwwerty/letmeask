import { createContext, ReactNode } from "react"
import toast, { Toaster } from "react-hot-toast";

type ToastType = {
  showToast: (text: string, type: 'success' | 'error') => void;
}

type ToastProviderData = {
  children: ReactNode;
}

export const ToastContext = createContext({} as ToastType)

export function ToastProvider({ children }: ToastProviderData) {
  function showToast(text: string, type = 'success') {
    if (type === 'success') {
      toast.success(text)
    } else {
      toast.error(text)
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
      />

      {children}
    </ToastContext.Provider>
  )
} 
