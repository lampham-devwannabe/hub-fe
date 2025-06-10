import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { Test, TestType, AnswerType } from './testSlice'
import {
  startExam,
  reportLostFocus,
  saveQuestionTime,
  saveProgress,
  submitExam,
  submitWritingFeedbacks,
  getTestAttempts
} from '../../services/Attempt'

export interface TestAttempt {
  attemptId: string
  studentId: string
  attemptNumber: number
  startTime: string
  endTime?: string
  score: number
  status: string
  aiFeedback: string
  totalTimeSpent: number
  quitCount: number
  test: Test
}

export interface SaveQuestionRequest {
  attemptId: string
  questionId: number
  answer: string
  timeSpent: number // seconds
}

export interface SaveProgressRequest {
  attemptId: string
  delta: number
}

export interface EditWritingRequest {
  responseId: string
  finalText: string
  teacherGraded: string // JSON stored as String
  finalScore: number
}

export interface WritingResponse {
  responseId: string
  attemptId: string
  questionId: number
  originalText: string
  finalText: string
  diffJson: string // JSON for differences stored as String
  aiGraded: string // JSON stored as String such as [6.5, 6.0, 6.5, 6.5, 6.5]
  teacherGraded: string // JSON stored as String
  finalScore: number
  submittedAt: string // ISO date string
  editedAt?: string // ISO date string
  editedBy?: string
}

export interface TestMonitorResponse {
  attemptId: string
  testName: string
  studentName: string
  score: number
  startTime: string // ISO date string
  feedback: string
  duration: number
  leaving: number
  endTime: string // ISO date string
  status: string
}

interface AttemptState {
  currentAttempt: TestAttempt | null
  loading: boolean
  error: string | null
  monitoredAttempts: TestMonitorResponse[]
}

const initialState: AttemptState = {
  currentAttempt: null,
  loading: false,
  error: null,
  monitoredAttempts: []
}

export const startTestAttempt = createAsyncThunk('attempt/start', async (testId: string, { rejectWithValue }) => {
  try {
    const response = await startExam(testId)
    if (response.code !== 1000) {
      return rejectWithValue(response.message || 'Failed to start exam')
    }

    // Map the raw response to TestAttempt interface
    const rawAttempt = response.result
    const mappedAttempt: TestAttempt = {
      attemptId: rawAttempt.attemptId,
      studentId: rawAttempt.studentId,
      attemptNumber: rawAttempt.attemptNumber,
      startTime: rawAttempt.startTime,
      endTime: rawAttempt.endTime,
      score: rawAttempt.score,
      status: rawAttempt.status,
      aiFeedback: rawAttempt.aiFeedback,
      totalTimeSpent: rawAttempt.totalTimeSpent,
      quitCount: rawAttempt.quitCount,
      test: rawAttempt.test
        ? {
            testId: rawAttempt.test.testId,
            testType: rawAttempt.test.testType || TestType.READING,
            title: rawAttempt.test.title,
            totalQuestions: rawAttempt.test.totalQuestions,
            durationMinutes: rawAttempt.test.durationMinutes,
            audioUrl: rawAttempt.test.audioUrl,
            startTime: rawAttempt.test.startTime,
            endTime: rawAttempt.test.endTime,
            allowedAttempts: rawAttempt.test.allowedAttempts,
            permissionId: rawAttempt.test.permissionId,
            createdBy: rawAttempt.test.createdBy,
            createdAt: rawAttempt.test.createdAt || new Date().toISOString(),
            modifiedBy: rawAttempt.test.modifiedBy,
            updatedAt: rawAttempt.test.updatedAt,
            sections: Array.isArray(rawAttempt.test.sections)
              ? rawAttempt.test.sections.map((section) => ({
                  sectionId: section.sectionId,
                  sectionNumber: section.sectionNumber,
                  title: section.title,
                  description: section.description,
                  instructions: section.instructions,
                  questionGroups: Array.isArray(section.questionGroups)
                    ? section.questionGroups.map((group) => ({
                        groupId: group.groupId,
                        questionType: group.questionType,
                        title: group.title,
                        content: group.content,
                        instructions: group.instructions,
                        imageUrl: group.imageUrl,
                        options: Array.isArray(group.options)
                          ? group.options.map((option) => ({
                              optionId: option.optionId,
                              optionKey: option.optionKey,
                              optionText: option.optionText
                            }))
                          : [],
                        tableHeaders: Array.isArray(group.tableHeaders)
                          ? group.tableHeaders.map((header) => ({
                              headerId: header.headerId,
                              columnIndex: header.columnIndex,
                              headerText: header.headerText
                            }))
                          : [],
                        tableRows: Array.isArray(group.tableRows)
                          ? group.tableRows.map((row) => ({
                              rowId: row.rowId,
                              rowIndex: row.rowIndex,
                              cells: Array.isArray(row.cells)
                                ? row.cells.map((cell) => ({
                                    cellId: cell.cellId,
                                    columnIndex: cell.columnIndex,
                                    cellText: cell.cellText,
                                    isQuestion: cell.isQuestion
                                  }))
                                : []
                            }))
                          : [],
                        supportingTexts: Array.isArray(group.supportingTexts)
                          ? group.supportingTexts.map((text) => ({
                              id: text.id,
                              title: text.title,
                              content: text.content,
                              startQuestionNumber: text.startQuestionNumber
                            }))
                          : [],
                        questions: group.questions?.map((question) => ({
                          questionId: question.questionId,
                          questionNumber: question.questionNumber,
                          cellId: question.cellId,
                          questionText: question.questionText,
                          prefix: question.prefix,
                          suffix: question.suffix,
                          maxWords: question.maxWords,
                          answerType: question.answerType || AnswerType.TEXT,
                          marks: question.marks,
                          options: question.options?.map((option) => ({
                            optionId: option.optionId,
                            optionKey: option.optionKey,
                            optionText: option.optionText
                          })),
                          answer: question.answer
                            ? {
                                answerId: question.answer.answerId,
                                correctAnswer: question.answer.correctAnswer,
                                explanation: question.answer.explanation
                              }
                            : undefined
                        }))
                      }))
                    : []
                }))
              : []
          }
        : rawAttempt.test
    }

    return mappedAttempt
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Unknown error'
    return rejectWithValue(errorMessage)
  }
})

export const handleLostFocus = createAsyncThunk('attempt/lostFocus', async (attemptId: string, { rejectWithValue }) => {
  try {
    const response = await reportLostFocus(attemptId)
    if (response.code !== 1000) {
      return rejectWithValue(response.message || 'Failed to report lost focus')
    }
    return response.result
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Unknown error'
    return rejectWithValue(errorMessage)
  }
})

export const saveQuestionTimeAction = createAsyncThunk(
  'attempt/saveQuestionTime',
  async (request: SaveQuestionRequest, { rejectWithValue }) => {
    try {
      const response = await saveQuestionTime(request)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to save question time')
      }
      return response.result
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)

export const saveProgressAction = createAsyncThunk(
  'attempt/saveProgress',
  async (request: SaveProgressRequest, { rejectWithValue }) => {
    try {
      const response = await saveProgress(request)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to save progress')
      }
      return response.result
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)

export const submitExamAction = createAsyncThunk(
  'attempt/submitExam',
  async (attemptId: string, { rejectWithValue }) => {
    try {
      const response = await submitExam(attemptId)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to submit exam')
      }
      return response.result
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)

export const submitWritingFeedbacksAction = createAsyncThunk(
  'attempt/submitWritingFeedbacks',
  async (requests: EditWritingRequest[], { rejectWithValue }) => {
    try {
      const response = await submitWritingFeedbacks(requests)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to submit writing feedbacks')
      }
      return response.result
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchTestAttemptsMonitor = createAsyncThunk(
  'attempt/fetchTestAttempts',
  async (testId: string, { rejectWithValue }) => {
    try {
      const response = await getTestAttempts(testId)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to fetch test attempts')
      }

      // Map the raw response to TestMonitorResponse[] interface
      const rawAttempts = response.result
      const mappedAttempts: TestMonitorResponse[] = Array.isArray(rawAttempts)
        ? rawAttempts.map((attempt) => ({
            attemptId: attempt.attemptId,
            testName: attempt.testName,
            studentName: attempt.studentName,
            score: attempt.score,
            startTime: attempt.startTime,
            feedback: attempt.feedback,
            duration: attempt.duration,
            leaving: attempt.leaving,
            endTime: attempt.endTime,
            status: attempt.status
          }))
        : []

      return mappedAttempts
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
        (error as { message?: string }).message ||
        'Unknown error'
      return rejectWithValue(errorMessage)
    }
  }
)

const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {
    clearAttempt(state) {
      state.currentAttempt = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTestAttempt.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(startTestAttempt.fulfilled, (state, action: PayloadAction<TestAttempt>) => {
        state.loading = false
        state.currentAttempt = action.payload
      })
      .addCase(startTestAttempt.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(handleLostFocus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(handleLostFocus.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(handleLostFocus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(saveQuestionTimeAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveQuestionTimeAction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(saveQuestionTimeAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(saveProgressAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveProgressAction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(saveProgressAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(submitExamAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitExamAction.fulfilled, (state) => {
        state.loading = false
        state.currentAttempt = null
      })
      .addCase(submitExamAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(submitWritingFeedbacksAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitWritingFeedbacksAction.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(submitWritingFeedbacksAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchTestAttemptsMonitor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTestAttemptsMonitor.fulfilled, (state, action: PayloadAction<TestMonitorResponse[]>) => {
        state.loading = false
        state.monitoredAttempts = action.payload
      })
      .addCase(fetchTestAttemptsMonitor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearAttempt } = attemptSlice.actions
export default attemptSlice.reducer
