import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-center gap-3 p-4 w-[400px] max-w-full rounded-lg border shadow-lg text-sm dark:bg-gray-900 animate-in slide-in-from-top-2 duration-300',

          title: 'text-sm font-semibold truncate',
          description: 'text-xs text-muted-foreground truncate mt-1',

          icon: 'p-1.5 rounded-full flex-shrink-0',

          success:
            'bg-green-50 border-2 border-green-400 text-green-800 [&_.icon]:bg-green-500 [&_.icon]:text-white shadow-green-100',
          error:
            'bg-red-50 border-2 border-red-500 text-red-900 [&_.icon]:bg-red-600 [&_.icon]:text-white shadow-red-200 ring-2 ring-red-200 ring-opacity-50',
          info: 'bg-blue-50 border-2 border-blue-400 text-blue-800 [&_.icon]:bg-blue-500 [&_.icon]:text-white shadow-blue-100',
          warning:
            'bg-yellow-50 border-2 border-yellow-500 text-yellow-900 [&_.icon]:bg-yellow-500 [&_.icon]:text-white shadow-yellow-200 ring-2 ring-yellow-300 ring-opacity-40',
          default: 'bg-white border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
