import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export const toastIcons = {
  success: <CheckCircle className='icon w-5 h-5' />,
  error: <XCircle className='icon w-5 h-5' />,
  warning: <AlertTriangle className='icon w-5 h-5' />,
  info: <Info className='icon w-5 h-5' />
}

type ToastVariant = keyof typeof toastIcons

type ToastOptions = {
  description?: string
  variant?: ToastVariant
  icon?: React.ReactNode
  duration?: number
}

export function showToast(message: string, options: ToastOptions = {}) {
  const { description, variant = 'info', icon = toastIcons[variant], duration } = options

  toast(message, {
    description,
    icon,
    duration: duration || 3000
  })
}
