import toast, { Toaster } from 'react-hot-toast'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const toastStyle = {
  background: '#1a1a1a',
  color: '#e8e8e8',
  border: '1px solid #2a2a2a',
  fontSize: '13px',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '8px',
  padding: '10px 14px',
}

// eslint-disable-next-line react-refresh/only-export-components
export const notify = {
  success: (message) =>
    toast.success(message, {
      icon: <CheckCircle size={16} className="text-accent-green" />,
      style: { ...toastStyle, borderColor: '#3dd68c44' },
    }),
  error: (message) =>
    toast.error(message, {
      icon: <XCircle size={16} className="text-accent-red" />,
      style: { ...toastStyle, borderColor: '#ff5f5f44' },
    }),
  warn: (message) =>
    toast(message, {
      icon: <AlertTriangle size={16} className="text-accent-yellow" />,
      style: { ...toastStyle, borderColor: '#f5c84244' },
    }),
  info: (message) =>
    toast(message, {
      icon: <Info size={16} className="text-accent-blue" />,
      style: { ...toastStyle, borderColor: '#4f9eff44' },
    }),
}

export function ToastContainer() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: toastStyle,
      }}
    />
  )
}
