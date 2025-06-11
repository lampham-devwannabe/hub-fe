// components/TestPerformance.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Card, CardContent } from '../../components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Progress } from '../../components/ui/progress'
import { Target, TrendingUp, FileCheck, Clock, CheckCircle, LayoutDashboard, BookOpen } from 'lucide-react'
import { Header } from '../../components/common/layout/Header'
import { Link } from 'react-router-dom'

// Mock prep test data
const mockPrepTests = [
  {
    id: 1,
    testType: 'Reading',
    title: 'Academic Reading Practice Test 1',
    description: 'Practice test focusing on various reading skills including skimming, scanning, and detailed reading.',
    date: '2024-03-20',
    time: '14:30'
  },
  {
    id: 2,
    testType: 'Writing',
    title: 'General Training Writing Test',
    description: 'Complete writing test with Task 1 (Letter) and Task 2 (Essay) components.',
    date: '2024-03-21',
    time: '10:00'
  },
  {
    id: 3,
    testType: 'Listening',
    title: 'IELTS Listening Full Test',
    description: 'Full-length listening test covering all four sections with increasing difficulty.',
    date: '2024-03-22',
    time: '09:00'
  }
]

const skillData = [
  { name: 'Listening', value: 12 },
  { name: 'Reading', value: 10 },
  { name: 'Writing', value: 8 }
]

const COLORS = ['#2563eb', '#1e40af', '#60a5fa'] // Deep blue shades

const questionAccuracy = {
  listening: [
    { type: 'Matching', accuracy: 51.59 },
    { type: 'Multiple Choice', accuracy: 64.8 },
    { type: 'MCA', accuracy: 63.33 },
    { type: 'Plan/Map/Diagram', accuracy: 42.86 }
  ],
  reading: [
    { type: 'True/False/NG', accuracy: 54.2 },
    { type: 'Matching Headings', accuracy: 58.7 },
    { type: 'Summary Completion', accuracy: 52.3 }
  ],
  writing: [
    { type: 'Task Response', accuracy: 66.4 },
    { type: 'Coherence & Cohesion', accuracy: 60.1 },
    { type: 'Grammar', accuracy: 55.5 }
  ]
}

// Mock student statistics data
const studentStats = {
  targetScore: 6.5,
  averageScore: 5.5,
  totalTests: 10,
  averageTime: '1:05',
  accuracy: 72.3
}

export default function StudentDashboard() {
  const [selectedSkill, setSelectedSkill] = useState('listening')
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderDashboardContent = () => (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        <Card className='p-4'>
          <CardContent className='p-0 flex flex-col items-center text-center'>
            <Target className='w-8 h-8 text-blue-600 mb-2' />
            <p className='text-2xl font-bold text-gray-900'>{studentStats.targetScore}</p>
            <p className='text-sm text-gray-600'>Target Score</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardContent className='p-0 flex flex-col items-center text-center'>
            <TrendingUp className='w-8 h-8 text-green-600 mb-2' />
            <p className='text-2xl font-bold text-gray-900'>{studentStats.averageScore}</p>
            <p className='text-sm text-gray-600'>Average Score</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardContent className='p-0 flex flex-col items-center text-center'>
            <FileCheck className='w-8 h-8 text-purple-600 mb-2' />
            <p className='text-2xl font-bold text-gray-900'>{studentStats.totalTests}</p>
            <p className='text-sm text-gray-600'>Total Tests</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardContent className='p-0 flex flex-col items-center text-center'>
            <Clock className='w-8 h-8 text-orange-600 mb-2' />
            <p className='text-2xl font-bold text-gray-900'>{studentStats.averageTime}</p>
            <p className='text-sm text-gray-600'>Average Time</p>
          </CardContent>
        </Card>

        <Card className='p-4'>
          <CardContent className='p-0 flex flex-col items-center text-center'>
            <CheckCircle className='w-8 h-8 text-emerald-600 mb-2' />
            <p className='text-2xl font-bold text-gray-900'>{studentStats.accuracy}%</p>
            <p className='text-sm text-gray-600'>Accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Performance Analysis */}
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Donut Chart */}
        <Card className='lg:w-1/3 w-full'>
          <CardContent className='p-4 flex flex-col items-center justify-center'>
            <p className='text-lg font-semibold text-center mb-2'>Test Distribution</p>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie
                  data={skillData}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name }) => name}
                >
                  {skillData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tab Section */}
        <Tabs value={selectedSkill} onValueChange={setSelectedSkill} className='lg:w-2/3 w-full'>
          <TabsList className='justify-start'>
            <TabsTrigger value='listening'>Listening</TabsTrigger>
            <TabsTrigger value='reading'>Reading</TabsTrigger>
            <TabsTrigger value='writing'>Writing</TabsTrigger>
          </TabsList>

          {/* LISTENING */}
          <TabsContent value='listening'>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <p className='text-lg font-semibold'>Question Types & Accuracy</p>
                {questionAccuracy.listening.map((q, i) => (
                  <div key={i} className='flex items-center justify-between text-sm'>
                    <span>{q.type}</span>
                    <Progress value={q.accuracy} className='w-2/3' />
                    <span className='font-medium w-[50px] text-right'>{q.accuracy.toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* READING */}
          <TabsContent value='reading'>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <p className='text-lg font-semibold'>Last Score & Common Errors</p>
                <div className='text-sm space-y-1'>
                  <p>
                    📊 Last Score: <span className='font-medium text-blue-600'>6.5</span>
                  </p>
                  <p>❌ Common Errors: Matching Headings, T/F/NG confusion</p>
                </div>

                <p className='text-lg font-semibold pt-4'>Question Types & Accuracy</p>
                {questionAccuracy.reading.map((q, i) => (
                  <div key={i} className='flex items-center justify-between text-sm'>
                    <span>{q.type}</span>
                    <Progress value={q.accuracy} className='w-2/3' />
                    <span className='font-medium w-[50px] text-right'>{q.accuracy.toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* WRITING */}
          <TabsContent value='writing'>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <p className='text-lg font-semibold'>Last Score & Common Errors</p>
                <div className='text-sm space-y-1'>
                  <p>
                    📊 Last Score: <span className='font-medium text-blue-600'>6.0</span>
                  </p>
                  <p>❌ Common Errors: Lack of cohesion, vague examples</p>
                </div>

                <p className='text-lg font-semibold pt-4'>Scoring Criteria Accuracy</p>
                {questionAccuracy.writing.map((q, i) => (
                  <div key={i} className='flex items-center justify-between text-sm'>
                    <span>{q.type}</span>
                    <Progress value={q.accuracy} className='w-2/3' />
                    <span className='font-medium w-[50px] text-right'>{q.accuracy.toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  const renderPrepTests = () => (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold text-gray-900 mb-6'>Available IELTS Prep Tests</h2>
      <div className='grid grid-cols-1 gap-4'>
        {mockPrepTests.map((test) => (
          <Link key={test.id} to='#' className='block'>
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm font-medium mb-2 ${
                        test.testType === 'Reading'
                          ? 'bg-blue-100 text-blue-700'
                          : test.testType === 'Writing'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {test.testType}
                    </span>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>{test.title}</h3>
                    <p className='text-gray-600 text-sm mb-3'>{test.description}</p>
                  </div>
                </div>
                <div className='flex items-center text-sm text-gray-500'>
                  <Clock className='w-4 h-4 mr-1' />
                  <span>
                    {test.date} at {test.time}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <div className='flex'>
        {/* Left Sidebar */}
        <div className='w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4'>
          <nav className='space-y-2'>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className='w-5 h-5' />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('preps')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'preps'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BookOpen className='w-5 h-5' />
              <span>Your IELTS Preps</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-6'>{activeTab === 'dashboard' ? renderDashboardContent() : renderPrepTests()}</div>
      </div>
    </div>
  )
}
