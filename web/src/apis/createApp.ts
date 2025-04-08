import axios from 'axios'
import { getPath } from './getPath'
import { AppSchema } from '@models/App'

export async function createApp(name: string, description?: string, category?: string) {
  return axios.post(getPath() + '/framework/v1/developer/apps', { name, description, category })
    .then((data) => {
      return AppSchema.parse(data)
    })
}

export async function createAppMultipart(files: File[]) {
  const formData = new FormData()

  // Append files to the FormData object
  files.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  return axios
    .post(getPath() + '/framework/v1/developer/apps', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((response) => {
      return AppSchema.parse(response)
    })
}