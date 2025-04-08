import axios from 'axios'
import { getPath } from './getPath'
import { IntegrationNodeSchema } from '@models/IntegrationNode'
import { z } from 'zod'

export function getNodes() {
  return axios.get(getPath() + '/framework/v1/admin/nodes').then((data) => {
    return z.array(IntegrationNodeSchema).parse(data)
  })
}