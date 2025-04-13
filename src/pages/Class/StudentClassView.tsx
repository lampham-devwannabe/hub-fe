import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'
import { cn } from '../../lib/utils'
import { useState } from 'react'
import { Header } from '../../components/common/layout/Header'

export const StudentClassView = () => {
  const { t } = useTranslation()
  const tabs = ['currentClass', 'pendingClass']
  const [activeTab, setActiveTab] = useState('currentClass')

  return (
    <div className='flex flex-col gap-4'>
      <Header />
      {/* Tabs */}
      <div className='flex items-center gap-2'>
        {tabs.map((tabKey) => (
          <Button
            key={tabKey}
            variant={activeTab === tabKey ? 'default' : 'ghost'}
            className={cn(
              activeTab === tabKey ? 'bg-blue-700 text-white' : 'bg-muted text-foreground hover:bg-muted/70',
              'rounded-xl px-4 py-2 text-sm font-medium'
            )}
            onClick={() => setActiveTab(tabKey)}
          >
            {t(`labels.${tabKey}`)}
          </Button>
        ))}
      </div>

      {/* Search & Actions */}
      <div className='flex flex-wrap items-center gap-2'>
        <Input placeholder={t('placeholders.search')} className='flex-1 min-w-[200px] max-w-[400px] rounded-md' />

        <Select>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder={t('placeholders.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='latest'>{t('labels.latest')}</SelectItem>
            <SelectItem value='az'>{t('labels.az')}</SelectItem>
          </SelectContent>
        </Select>

        <Button className='bg-blue-600 hover:bg-blue-700 text-white rounded-md'>+ {t('actions.findClass')}</Button>
      </div>
    </div>
  )
}
