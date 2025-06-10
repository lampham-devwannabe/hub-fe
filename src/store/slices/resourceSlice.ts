import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { uploadFile, UploadParams } from '../../services/Resources'

export const uploadResource = createAsyncThunk('resource/upload', async (params: UploadParams, { rejectWithValue }) => {
  try {
    const response = await uploadFile(params)
    return response.result
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    return rejectWithValue(errorMessage)
  }
})

interface ResourceState {
  uploading: boolean
  uploadError: string | null
  uploadedUrl: string | null
}

const initialState: ResourceState = {
  uploading: false,
  uploadError: null,
  uploadedUrl: null
}

const resourceSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.uploading = false
      state.uploadError = null
      state.uploadedUrl = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResource.pending, (state) => {
        state.uploading = true
        state.uploadError = null
      })
      .addCase(uploadResource.fulfilled, (state, action) => {
        state.uploading = false
        state.uploadedUrl = action.payload
      })
      .addCase(uploadResource.rejected, (state, action) => {
        state.uploading = false
        state.uploadError = action.payload as string
      })
  }
})

export const { clearUploadState } = resourceSlice.actions
export default resourceSlice.reducer
