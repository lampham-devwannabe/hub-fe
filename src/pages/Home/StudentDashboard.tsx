// components/TestPerformance.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Card, CardContent } from '../../components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Progress } from '../../components/ui/progress'
import { Target, TrendingUp, FileCheck, Clock, CheckCircle } from 'lucide-react'

const skillData = [
  { name: 'Listening', value: 12 },
  { name: 'Reading', value: 10 },
  { name: 'Writing', value: 8 }
]

const COLORS = ['#2563eb', '#1e40af', '#60a5fa'] // Deep blue shades

const questionAccuracy = {
  listening: [
    { type: 'Matching', accuracy: 71.59 },
    { type: 'Multiple Choice', accuracy: 74.8 },
    { type: 'MCA', accuracy: 83.33 },
    { type: 'Plan/Map/Diagram', accuracy: 42.86 }
  ],
  reading: [
    { type: 'True/False/NG', accuracy: 64.2 },
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
  targetScore: 7.5,
  averageScore: 6.8,
  totalTests: 24,
  averageTime: '1:05',
  accuracy: 72.3
}

export default function TestPerformance() {
  const [selectedSkill, setSelectedSkill] = useState('listening')

  return (
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

      {/* Existing Chart and Performance Analysis */}
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
}
