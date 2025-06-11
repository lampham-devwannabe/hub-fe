import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { BookOpen, Users, Trophy, TrendingUp, CheckCircle, XCircle } from 'lucide-react'

const TestOverviewDashboard = () => {
  // Mock data for score frequency (4.0 to 7.0, only .0 and .5 accepted)
  const scoreData = [
    { score: '4.0', students: 1, color: '#ef4444' },
    { score: '4.5', students: 2, color: '#f97316' },
    { score: '5.0', students: 3, color: '#eab308' },
    { score: '5.5', students: 5, color: '#84cc16' },
    { score: '6.0', students: 6, color: '#22c55e' },
    { score: '6.5', students: 2, color: '#3b82f6' },
    { score: '7.0', students: 1, color: '#8b5cf6' }
  ]

  const totalStudents = scoreData.reduce((sum, item) => sum + item.students, 0)
  const averageScore = (
    scoreData.reduce((sum, item) => sum + parseFloat(item.score) * item.students, 0) / totalStudents
  ).toFixed(1)
  const passRate = Math.round(
    (scoreData.filter((item) => parseFloat(item.score) >= 5.0).reduce((sum, item) => sum + item.students, 0) /
      totalStudents) *
      100
  )

  // Mock question performance data
  const questionData = [
    { question: 1, correct: 18, wrong: 2, percentage: 90 },
    { question: 2, correct: 16, wrong: 4, percentage: 80 },
    { question: 3, correct: 13, wrong: 7, percentage: 65 },
    { question: 4, correct: 12, wrong: 8, percentage: 60 },
    { question: 5, correct: 15, wrong: 5, percentage: 75 }
  ]

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-white p-3 rounded-lg shadow-lg border'>
          <p className='font-semibold text-gray-800'>{`Score: ${data.score}`}</p>
          <p className='text-blue-600'>{`${data.students} students`}</p>
          <p className='text-gray-600'>{`${((data.students / totalStudents) * 100).toFixed(1)}%`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <Card className='bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0'>
          <CardHeader className='text-center py-8'>
            <div className='flex items-center justify-center gap-3 mb-2'>
              <BookOpen className='w-8 h-8' />
              <CardTitle className='text-3xl font-bold'>Test Overview Dashboard</CardTitle>
            </div>
            <p className='text-blue-100 text-lg'>Advanced Mathematics - Final Assessment Results</p>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <Users className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>{totalStudents}</p>
                  <p className='text-sm text-gray-600'>Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-green-100 rounded-full'>
                  <TrendingUp className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>{averageScore}</p>
                  <p className='text-sm text-gray-600'>Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-yellow-100 rounded-full'>
                  <CheckCircle className='w-6 h-6 text-yellow-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>{passRate}%</p>
                  <p className='text-sm text-gray-600'>Pass Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-purple-100 rounded-full'>
                  <Trophy className='w-6 h-6 text-purple-600' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-800'>7.0</p>
                  <p className='text-sm text-gray-600'>Highest Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Distribution Chart */}
        <Card className='hover:shadow-lg transition-all duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>📊 Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80 w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={scoreData}
                    dataKey='students'
                    nameKey='score'
                    cx='50%'
                    cy='50%'
                    outerRadius={140}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Question Performance */}
        <Card className='hover:shadow-lg transition-all duration-300'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl text-gray-800'>
              📝 Question Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {questionData.map((q) => (
                <Card
                  key={q.question}
                  className='bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-md transition-all duration-300'
                >
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='font-semibold text-gray-800'>Question {q.question}</h3>
                      <Badge variant={q.percentage >= 70 ? 'default' : 'destructive'} className='text-xs'>
                        {q.percentage}%
                      </Badge>
                    </div>

                    <div className='flex justify-between items-center mb-3'>
                      <div className='flex items-center gap-2 text-green-600'>
                        <CheckCircle className='w-4 h-4' />
                        <span className='font-semibold text-lg'>{q.correct}</span>
                        <span className='text-sm text-gray-600'>Correct</span>
                      </div>
                      <div className='flex items-center gap-2 text-red-500'>
                        <XCircle className='w-4 h-4' />
                        <span className='font-semibold text-lg'>{q.wrong}</span>
                        <span className='text-sm text-gray-600'>Wrong</span>
                      </div>
                    </div>

                    <Progress value={q.percentage} className='h-2' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TestOverviewDashboard
