import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { TestMonitorResponse } from '../../store/slices/attemptSlice'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Clock, Users, AlertTriangle, UserX, RotateCcw } from 'lucide-react'
import { showToast } from '../../components/common/toast/Toast'

interface TestDetailPageProps {
  testMonitorResponse?: TestMonitorResponse[]
}

interface WebSocketMessage {
  event: 'STARTED' | 'STUDENT_SUBMITTED' | 'STUDENT_LEFT' | 'TIME_UPDATE'
  attemptId: string
  studentName?: string
  score?: number
  start?: string
  feedback?: string
  duration?: string
  leaving?: number
  quitCount?: number
  endTime?: string
}

// Mock data for demonstration (fallback when no Redux data)
const mockTestMonitorData: TestMonitorResponse[] = [
  {
    attemptId: '1',
    testName: 'IELTS Reading Test - Academic Module',
    studentName: 'Alice Johnson',
    score: 85,
    startTime: '2024-01-15T09:00:00Z',
    feedback:
      '• Struggles with inference questions in passage 2\n• Strong performance on factual questions\n• Needs improvement on vocabulary matching',
    duration: 3600, // 60 minutes in seconds
    leaving: 2,
    endTime: '2024-01-15T10:00:00Z',
    status: 'completed'
  },
  {
    attemptId: '2',
    testName: 'IELTS Reading Test - Academic Module',
    studentName: 'Bob Chen',
    score: 72,
    startTime: '2024-01-15T09:30:00Z',
    feedback:
      '• Difficulty with paragraph headings questions\n• Good grasp of main ideas\n• Time management issues in section 3',
    duration: 4200, // 70 minutes in seconds
    leaving: 0,
    endTime: '2024-01-15T10:40:00Z',
    status: 'completed'
  },
  {
    attemptId: '3',
    testName: 'IELTS Reading Test - Academic Module',
    studentName: 'Emma Wilson',
    score: 0,
    startTime: '2024-01-15T10:00:00Z',
    feedback: '• Multiple exits during test\n• Poor focus and concentration\n• Needs additional support and practice',
    duration: 1800, // 30 minutes in seconds
    leaving: 5,
    endTime: '',
    status: 'suspended'
  },
  {
    attemptId: '4',
    testName: 'IELTS Reading Test - Academic Module',
    studentName: 'David Rodriguez',
    score: 78,
    startTime: '2024-01-15T11:00:00Z',
    feedback:
      '• Strong analytical skills\n• Occasional misunderstanding of complex sentences\n• Good overall comprehension',
    duration: 3300, // 55 minutes in seconds
    leaving: 1,
    endTime: '2024-01-15T11:55:00Z',
    status: 'completed'
  },
  {
    attemptId: '5',
    testName: 'IELTS Reading Test - Academic Module',
    studentName: 'Sarah Kim',
    score: 0,
    startTime: '2024-01-15T11:30:00Z',
    feedback: '• Currently in progress\n• Spending appropriate time on each section\n• No major issues detected so far',
    duration: 2100, // 35 minutes in seconds (ongoing)
    leaving: 0,
    endTime: '',
    status: 'in_progress'
  }
]

const TestDetailPage: React.FC<TestDetailPageProps> = ({ testMonitorResponse }) => {
  const { id: testId } = useParams<{ id: string }>()
  const [monitorData, setMonitorData] = useState<TestMonitorResponse[]>(testMonitorResponse || mockTestMonitorData)
  const [loading] = useState(false)
  const stompClient = useRef<Client | null>(null)

  // WebSocket connection setup
  useEffect(() => {
    if (!testId) return

    // Create STOMP client with SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP Debug:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    })

    // Connection established
    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame)

      // Subscribe to test-specific topic
      client.subscribe(`/topic/monitor/test${testId}`, (message) => {
        try {
          const data: WebSocketMessage = JSON.parse(message.body)
          handleWebSocketMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      })

      showToast('Connected to live monitoring', { variant: 'info' })
    }

    // Connection error
    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame)
      showToast('Connection error - monitoring may be delayed', { variant: 'warning' })
    }

    // WebSocket connection error
    client.onWebSocketError = (error) => {
      console.error('WebSocket Error:', error)
      showToast('WebSocket connection failed', { variant: 'error' })
    }

    // Activate connection
    client.activate()
    stompClient.current = client

    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate()
        console.log('WebSocket connection closed')
      }
    }
  }, [testId])

  // Handle different WebSocket message types
  const handleWebSocketMessage = (data: WebSocketMessage) => {
    console.log('Received WebSocket message:', data)

    setMonitorData((prevData) => {
      switch (data.event) {
        case 'STARTED': {
          // Add new student or update existing
          const existingIndex = prevData.findIndex((item) => item.attemptId === data.attemptId)

          if (existingIndex >= 0) {
            // Update existing attempt
            const updatedData = [...prevData]
            updatedData[existingIndex] = {
              ...updatedData[existingIndex],
              startTime: data.start || updatedData[existingIndex].startTime,
              duration: parseDurationToSeconds(data.duration || '0 minutes'),
              leaving: data.leaving || 0,
              feedback: data.feedback || updatedData[existingIndex].feedback,
              status: 'in_progress'
            }
            showToast(`${data.studentName} started the test`, { variant: 'info' })
            return updatedData
          } else {
            // Add new attempt
            const newAttempt: TestMonitorResponse = {
              attemptId: data.attemptId,
              testName: prevData[0]?.testName || 'Test',
              studentName: data.studentName || 'Unknown Student',
              score: data.score || 0,
              startTime: data.start || new Date().toISOString(),
              feedback: data.feedback || 'Test in progress',
              duration: parseDurationToSeconds(data.duration || '0 minutes'),
              leaving: data.leaving || 0,
              endTime: '',
              status: 'in_progress'
            }
            showToast(`${data.studentName} joined the test`, { variant: 'info' })
            return [...prevData, newAttempt]
          }
        }

        case 'STUDENT_SUBMITTED':
          showToast(`${data.studentName} submitted the test`, { variant: 'success' })
          return prevData.map((item) =>
            item.attemptId === data.attemptId
              ? {
                  ...item,
                  score: data.score !== undefined ? data.score : item.score,
                  feedback: data.feedback || item.feedback,
                  endTime: data.endTime || new Date().toISOString(),
                  status: 'completed'
                }
              : item
          )

        case 'STUDENT_LEFT': {
          const newQuitCount = data.quitCount !== undefined ? data.quitCount : data.leaving || 0

          // Show different toast based on quit count
          if (newQuitCount > 2) {
            showToast(`${data.studentName} left the test (${newQuitCount} times)`, { variant: 'warning' })
          } else {
            showToast(`${data.studentName} temporarily left the test`, { variant: 'info' })
          }

          return prevData.map((item) => (item.attemptId === data.attemptId ? { ...item, leaving: newQuitCount } : item))
        }

        case 'TIME_UPDATE':
          return prevData.map((item) =>
            item.attemptId === data.attemptId
              ? { ...item, duration: parseDurationToSeconds(data.duration || '0 minutes') }
              : item
          )

        default:
          console.warn('Unknown WebSocket event:', data.event)
          return prevData
      }
    })
  }

  // Parse duration string like "30 minutes" to seconds
  const parseDurationToSeconds = (durationString: string): number => {
    const match = durationString.match(/(\d+)\s*minutes?/)
    if (match) {
      return parseInt(match[1]) * 60
    }
    return 0
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return 'N/A'
    return new Date(dateTime).toLocaleString()
  }

  const getLeavingIndicator = (leavingCount: number) => {
    if (leavingCount === 0) {
      return <span className='text-green-600 font-medium'>0</span>
    } else if (leavingCount <= 2) {
      return <span className='text-yellow-600 font-medium'>{leavingCount}</span>
    } else {
      return <span className='text-red-600 font-medium'>{leavingCount}</span>
    }
  }

  const formatFeedback = (feedback: string) => {
    return feedback.split('\n').map((item, index) => (
      <div key={index} className='text-sm text-gray-700 mb-1'>
        {item}
      </div>
    ))
  }

  const handleSuspendStudent = (attemptId: string) => {
    setMonitorData((prev) =>
      prev.map((attempt) => (attempt.attemptId === attemptId ? { ...attempt, status: 'suspended' } : attempt))
    )
    // In real implementation, this would call an API
    const student = monitorData.find((attempt) => attempt.attemptId === attemptId)
    if (student) {
      showToast(`${student.studentName} has been suspended`, { variant: 'warning' })
    }
    console.log(`Suspending student with attempt ID: ${attemptId}`)
  }

  const handleReassignTest = (attemptId: string) => {
    // In real implementation, this would call an API to reassign the test
    const student = monitorData.find((attempt) => attempt.attemptId === attemptId)
    if (student) {
      showToast(`Test reassigned for ${student.studentName}`, { variant: 'info' })
    }
    console.log(`Reassigning test for attempt ID: ${attemptId}`)
  }

  const testName = monitorData.length > 0 ? monitorData[0].testName : 'Test Monitor'

  if (loading) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <div className='text-lg'>Loading test monitoring data...</div>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>{testName}</h1>
          <p className='text-gray-600 mt-1'>Monitor student progress and performance</p>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            <Users className='w-4 h-4' />
            <span>{monitorData.length} Students</span>
          </div>
          <div className='flex items-center space-x-2 text-sm text-gray-600'>
            <Clock className='w-4 h-4' />
            <span>Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{monitorData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {monitorData.filter((d) => d.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {monitorData.filter((d) => d.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-600'>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {monitorData.filter((d) => d.leaving > 2 || d.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[150px]'>Student Name</TableHead>
                <TableHead className='w-[80px]'>Score</TableHead>
                <TableHead className='w-[140px]'>Start Time</TableHead>
                <TableHead className='w-[300px]'>Feedback</TableHead>
                <TableHead className='w-[100px]'>Duration</TableHead>
                <TableHead className='w-[80px]'>Leaving</TableHead>
                <TableHead className='w-[140px]'>End Time</TableHead>
                <TableHead className='w-[160px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitorData.map((attempt) => (
                <TableRow key={attempt.attemptId}>
                  <TableCell className='font-medium'>{attempt.studentName}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        attempt.score >= 80
                          ? 'text-green-600'
                          : attempt.score >= 60
                            ? 'text-yellow-600'
                            : attempt.score > 0
                              ? 'text-red-600'
                              : 'text-gray-400'
                      }`}
                    >
                      {attempt.score > 0 ? `${attempt.score}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className='text-sm text-gray-600'>{formatDateTime(attempt.startTime)}</TableCell>
                  <TableCell className='max-w-[300px]'>
                    <div className='space-y-1'>{formatFeedback(attempt.feedback)}</div>
                  </TableCell>
                  <TableCell className='text-sm'>{formatDuration(attempt.duration)}</TableCell>
                  <TableCell className='text-center'>
                    <div className='flex items-center justify-center space-x-1'>
                      {getLeavingIndicator(attempt.leaving)}
                      {attempt.leaving > 2 && <AlertTriangle className='w-4 h-4 text-red-500' />}
                    </div>
                  </TableCell>
                  <TableCell className='text-sm text-gray-600'>{formatDateTime(attempt.endTime)}</TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      {attempt.status !== 'suspended' && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleSuspendStudent(attempt.attemptId)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        >
                          <UserX className='w-3 h-3 mr-1' />
                          Suspend
                        </Button>
                      )}
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleReassignTest(attempt.attemptId)}
                        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      >
                        <RotateCcw className='w-3 h-3 mr-1' />
                        Reassign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestDetailPage
