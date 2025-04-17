import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export const toastIcons = {
  success: <CheckCircle className='icon' />,
  error: <XCircle className='icon' />,
  warning: <AlertTriangle className='icon' />,
  info: <Info className='icon' />
}

type ToastVariant = keyof typeof toastIcons

type ToastOptions = {
  description?: string
  variant?: ToastVariant
  icon?: React.ReactNode
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { description, variant = 'info', icon = toastIcons[variant] } = options

  toast(message, {
    description,
    icon
  })
}
