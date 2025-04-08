import axios from 'axios'
import { getPath } from './getPath'
import { AppSchema } from '@models/App'
import { z } from 'zod'

export function getAppList() {
  return axios.get(getPath() + '/framework/v1/developer/apps/').then((data) => {
    return z.array(AppSchema).parse(data)
  })
}