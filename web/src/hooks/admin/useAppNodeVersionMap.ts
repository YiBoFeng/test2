import { useState, useEffect } from 'react'
import { AppVerison } from '@models/AppVersion'
import { getNodes } from '@src/apis/getNodes'
import { IntegrationNode } from '@src/models/IntegrationNode'
import { deployApp } from '@src/apis/deployApp'
import { getAppNodeVersion } from '@src/apis/admin/getAppNodeVersion'

export function useAppNodeVersionMap(appId: string) {
  const [allNodes, setAllNodes] = useState<IntegrationNode[]>([])
  const [nodeAppVersionMap, setNodeAppVersionMap] = useState<Map<IntegrationNode, AppVerison>>(new Map())

  useEffect(() => {
    getNodes().then(async(nodes) => {
      setAllNodes(nodes)
      
      const validNodes = nodes.filter((node) => node.node_id)
      const versionPromises = validNodes.map((node) => 
        getAppNodeVersion(appId, node.node_id!)
          .then((version) => ({ node, version }))
          .catch(() => ({ node, version: null })),
      )

      const results = await Promise.all(versionPromises)
      
      const newMap = new Map()
      results.forEach(({ node, version }) => {
        newMap.set(node, version)
      })
      
      setNodeAppVersionMap(newMap)
    })
  }, [appId])

  function deployAppVersion(node_id: string, version: AppVerison) {
    if (!version || !version.version_id || !node_id) {
      return
    }
    return deployApp(appId, version.version_id, node_id).then(() => {
      const updatedNodes = version.nodes ? [...version.nodes] : []
      updatedNodes.push({ node_id })
      const node = allNodes.find((node) => node.node_id === node_id)
      if (node) {
        setNodeAppVersionMap((prevMap) => new Map(prevMap).set(node, version))
      }
    }).catch(() => {
      alert('Failed to deploy')
    })
  }

  return {
    allNodes,
    nodeAppVersionMap,
    deployAppVersion,
  }
}
