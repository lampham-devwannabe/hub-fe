import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const formSchema = z.object({
  code: z.string().length(6, { message: 'Please enter a valid class code' }),
  pass: z.string()
})

interface FindClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { code: string; pass?: string }) => void
}

export function FindClassDialog({ open, onOpenChange, onSubmit }: FindClassDialogProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: '', pass: '' }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline'>{t('actions.findClass')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('actions.findClass')}</DialogTitle>
          <DialogDescription>Find class here. If class has no password let it empty</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 py-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('labels.classCode')}</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={t('emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage>{t(form.formState.errors.code?.message || '')}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pass'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('labels.password')}</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder={t('emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage>{t(form.formState.errors.pass?.message || '')}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>{t('labels.submit')}</Button>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
