import axios from 'axios'
import { getPath } from './getPath'
import { App, AppSchema } from '@models/App'

export function updateApp(appId: string, app: App) {
  const payload: Partial<App> = Object.assign({}, app)
  delete payload.app_id
  return axios.patch(getPath() + '/framework/v1/developer/apps/' + appId, payload)
    .then((data) => {
      return AppSchema.parse(data)
    })
}

export async function updateAppMultipart(appId: string, files: File[]) {
  const formData = new FormData()

  // Append files to the FormData object
  files.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  return axios.patch(getPath() + '/framework/v1/developer/apps/' + appId, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then((response) => {
      return AppSchema.parse(response)
    })
}