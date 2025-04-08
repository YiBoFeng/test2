import axios from 'axios'
import { getPath } from './getPath'
import { AppSchema } from '@models/App'
import { z } from 'zod'

export function getGlobalAppList() {
  return axios.get(getPath() + '/framework/v1/admin/apps').then((data) => {
    return z.array(AppSchema).parse(data)
  })
}