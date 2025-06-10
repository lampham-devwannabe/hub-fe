import api, { ApiResponse } from '../../utils/api'

export enum FileType {
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE'
}

export interface UploadParams {
  folder: string
  fileType: FileType
  targetId: string
  file: File
}

export const uploadFile = async (params: UploadParams): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  formData.append('file', params.file)

  const response = await api.post('/upload', formData, {
    params: {
      folder: params.folder,
      fileType: params.fileType,
      targetId: params.targetId
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}
