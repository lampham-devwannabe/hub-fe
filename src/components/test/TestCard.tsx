import { Headphones, BookOpen, PenTool, Clock } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import { GeneralTestAttemptResponse } from '../../store/slices/classSlice'

export type TestMode = 'student' | 'teacher'

interface TestCardProps {
  test: GeneralTestAttemptResponse
  mode: TestMode
  isSelected: boolean
  onClick: () => void
  studentCount: number
}

const TestCard = ({ test, mode, isSelected, onClick, studentCount }: TestCardProps) => {
  const getTestIcon = (type: GeneralTestAttemptResponse['testType']) => {
    const iconMap = {
      LISTENING: Headphones,
      READING: BookOpen,
      WRITING: PenTool
    }
    const Icon = iconMap[type]
    return <Icon className='w-5 h-5' />
  }

  const getStatusBadge = () => {
    if (mode === 'student') {
      const isDone = test.attemptNumber && test.attemptNumber > 0
      return <Badge variant={isDone ? 'default' : 'destructive'}>{isDone ? 'Finished' : 'Not Done'}</Badge>
    } else {
      const attempts = test.numberOfAttempts || 0
      const variant =
        attempts / studentCount > 0.8 ? 'default' : attempts / studentCount > 0.5 ? 'secondary' : 'destructive'
      return (
        <Badge variant={variant}>
          {attempts} / {studentCount}
        </Badge>
      )
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-3 flex-1'>
            <div className='p-2 bg-muted rounded-lg'>{getTestIcon(test.testType)}</div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold truncate'>{test.title}</h3>
              <p className='text-sm text-muted-foreground capitalize'>{test.testType.toLowerCase()} Test</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className='flex items-center justify-between text-sm text-muted-foreground'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              <span>{test.durationMinutes} min</span>
            </div>
            {mode === 'student' && test.score !== undefined && <Badge variant='outline'>Band {test.score}</Badge>}
            {mode === 'teacher' && test.averageScore !== undefined && (
              <Badge variant='outline'>Avg Band {test.averageScore.toFixed(1)}</Badge>
            )}
          </div>
          <span>{new Date(test.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })}</span>
        </div>

        {mode === 'student' && test.attemptNumber && test.attemptNumber > 0 && (
          <>
            <Separator className='my-2' />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>Attempt #{test.attemptNumber}</span>
              {test.totalTimeSpent && <span>Time: {Math.round(test.totalTimeSpent / 60)} min</span>}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default TestCard
