import { useTranslation } from 'react-i18next'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select'
import { cn } from '../../lib/utils'
import { useState } from 'react'
import { Header } from '../../components/common/layout/Header'
import { FindClassDialog } from '../../components/class/FindClassDialog'
import { LeftSideBar } from '../../components/common/layout/OverviewLeftSidebar'

export const StudentClassView = () => {
  const { t } = useTranslation()
  const tabs = ['currentClass', 'pendingClass']
  const [activeTab, setActiveTab] = useState('currentClass')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (values: { code: string; pass?: string }) => {
    console.log('tìm lớp với:', values)
    setDialogOpen(false)
    // gọi API hoặc xử lý logic ở đây
  }
  return (
    <div className='flex flex-col h-screen'>
      {/* Header cố định phía trên */}
      <div className='w-full'>
        <Header />
      </div>
      <div className='flex flex-1'>
        <div className='w-64 overflow-y-auto'>
          <LeftSideBar />
        </div>
        {/* Main Content */}
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='flex flex-col gap-4'>
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

              <FindClassDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
