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
            'flex items-center gap-3 p-3 w-[360px] max-w-full rounded-lg border bg-white shadow-sm text-sm dark:bg-gray-900',

          title: 'text-sm font-medium truncate',
          description: 'text-xs text-muted-foreground truncate',

          icon: 'p-1 rounded-full',

          success: 'border border-green-300 [&_.icon]:bg-green-500 [&_.icon]:text-white',
          error: 'border border-red-300 [&_.icon]:bg-red-500 [&_.icon]:text-white',
          info: 'border border-blue-300 [&_.icon]:bg-blue-500 [&_.icon]:text-white',
          warning: 'border border-yellow-300 [&_.icon]:bg-yellow-400 [&_.icon]:text-black',
          default: 'border border-gray-200 dark:border-gray-700'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
