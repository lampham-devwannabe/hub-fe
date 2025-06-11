import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getTestById, getExistingTests, editTest, EditTestRequest, importTest } from '../../services/Test'

export interface Answer {
  answerId: number
  correctAnswer: string
  explanation?: string
}

export interface Option {
  optionId: number
  optionKey: string
  optionText: string
}

export interface SeparateOption {
  optionId: number
  optionKey: string
  optionText: string
}

export enum AnswerType {
  TEXT = 'text',
  OPTION_SELECT = 'optionSelect'
}

export interface Question {
  questionId: number
  cellId?: number
  questionNumber: number
  questionText?: string
  prefix?: string
  suffix?: string
  maxWords?: number
  answerType: AnswerType
  marks?: number
  options?: SeparateOption[]
  answer?: Answer
  // cell?: TableCell
}

export interface QuestionGroup {
  groupId: string
  questionType: string
  title: string
  content?: string
  instructions: string
  imageUrl?: string
  questions: Question[]
  options?: Option[]
  tableHeaders?: TableHeader[]
  tableRows?: TableRow[]
  supportingTexts?: SupportingText[]
}

export interface Section {
  sectionId: string
  sectionNumber: number
  title: string
  description?: string
  instructions?: string
  questionGroups: QuestionGroup[]
}

export interface SupportingText {
  id: number
  title?: string // e.g., "Introduction", "Recent Research"
  content?: string // e.g., "Recent urban developments..."
  startQuestionNumber: number // e.g., 31, 33
}

export interface TableCell {
  cellId: number
  columnIndex: number
  cellText: string
  isQuestion: boolean
}

export interface TableHeader {
  headerId: number
  columnIndex: number
  headerText: string
}

export interface TableRow {
  rowId: number
  rowIndex: number
  cells?: TableCell[]
}

export enum TestType {
  READING = 'READING',
  LISTENING = 'LISTENING',
  WRITING = 'WRITING'
  // CUSTOM = 'CUSTOM'
}

export interface Test {
  testId: string
  testType: TestType
  title: string
  totalQuestions: number
  durationMinutes: number
  audioUrl?: string
  startTime?: string
  endTime?: string
  allowedAttempts?: number
  permissionId?: number
  createdBy: string
  createdAt: string // ISO date string
  modifiedBy?: string
  updatedAt?: string // ISO date string
  sections?: Section[]
}

export const saveTest = createAsyncThunk('test/saveTest', async (editRequest: EditTestRequest, { rejectWithValue }) => {
  try {
    const response = await editTest(editRequest)
    if (response.code !== 1000) {
      return rejectWithValue(response.message || 'Save failed')
    }
    return response.result
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Save failed'
    return rejectWithValue(errorMessage)
  }
})

export interface ImportTestParams {
  file: File
  testType: string
}

export const importTestAction = createAsyncThunk(
  'test/import',
  async ({ file, testType }: ImportTestParams, { rejectWithValue }) => {
    try {
      const response = await importTest(file, testType)
      if (response.code !== 1000) {
        return rejectWithValue(response.message || 'Failed to import test')
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

interface TestState {
  currentTest: Test | null
  existingTests: Test[]
  loading: boolean
  error: string | null
  saving: boolean
  saveSuccess: boolean
}

const initialState: TestState = {
  currentTest: null,
  existingTests: [],  
  loading: false,
  error: null,
  saving: false,
  saveSuccess: false
}

export const fetchTestById = createAsyncThunk('test/fetchById', async (testId: string, { rejectWithValue }) => {
  try {
    const response = await getTestById(testId)
    if (response.code !== 1000) {
      return rejectWithValue(response.message || 'Đã có lỗi xảy ra')
    }
    // Map the raw response to Test interface
    const rawTest = response.result
    const mappedTest: Test = {
      testId: rawTest.testId,
      testType: rawTest.testType || TestType.READING,
      title: rawTest.title,
      totalQuestions: rawTest.totalQuestions,
      durationMinutes: rawTest.durationMinutes,
      audioUrl: rawTest.audioUrl,
      startTime: rawTest.startTime,
      endTime: rawTest.endTime,
      allowedAttempts: rawTest.allowedAttempts,
      permissionId: rawTest.permissionId,
      createdBy: rawTest.createdBy,
      createdAt: rawTest.createdAt || new Date().toISOString(),
      modifiedBy: rawTest.modifiedBy,
      updatedAt: rawTest.updatedAt,
      sections: Array.isArray(rawTest.sections)
        ? rawTest.sections.map((section) => ({
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
                  questions: group.questions?.map((question: Question) => ({
                    questionId: question.questionId,
                    questionNumber: question.questionNumber,
                    cellId: question.cellId,
                    questionText: question.questionText,
                    prefix: question.prefix,
                    suffix: question.suffix,
                    maxWords: question.maxWords,
                    answerType: question.answerType || AnswerType.TEXT,
                    marks: question.marks,
                    options: question.options?.map((option: SeparateOption) => ({
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
                    // cell: question.cell
                    //   ? {
                    //       cellId: question.cell.cellId,
                    //       columnIndex: question.cell.columnIndex,
                    //       cellText: question.cell.cellText,
                    //       isQuestion: question.cell.isQuestion
                    //     }
                    //   : undefined
                  }))
                }))
              : []
          }))
        : []
    }

    return mappedTest
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Lỗi không xác định'
    return rejectWithValue(errorMessage)
  }
})

export const fetchExistingTests = createAsyncThunk('test/fetchExisting', async (_, { rejectWithValue }) => {
  try {
    const response = await getExistingTests()
    if (response.code !== 1000) {
      return rejectWithValue(response.message || 'Đã có lỗi xảy ra')
    }
    return response.result
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message ||
      (error as { message?: string }).message ||
      'Lỗi không xác định'
    return rejectWithValue(errorMessage)
  }
})

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    clearTest(state) {
      state.currentTest = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTestById.fulfilled, (state, action: PayloadAction<Test>) => {
        state.loading = false
        state.currentTest = action.payload
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchExistingTests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExistingTests.fulfilled, (state, action: PayloadAction<Test[]>) => {
        state.loading = false
        state.existingTests = action.payload
      })
      .addCase(fetchExistingTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(saveTest.pending, (state) => {
        state.saving = true
        state.saveSuccess = false
      })
      .addCase(saveTest.fulfilled, (state) => {
        state.saving = false
        state.saveSuccess = true
      })
      .addCase(saveTest.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload as string
      })
      .addCase(importTestAction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(importTestAction.fulfilled, (state, action: PayloadAction<Test>) => {
        state.loading = false
        state.currentTest = action.payload
      })
      .addCase(importTestAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearTest } = testSlice.actions
export default testSlice.reducer
