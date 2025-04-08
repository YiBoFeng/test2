import { useEffect, useState } from 'react'
import { getFunction } from '@apis/getFunction'
import { Func, FuncType } from '@models/Func'
import { deleteFunction } from '@apis/deleteFunction'
import { updateFunction } from '@apis/updateFunction'
import { createFunction } from '@apis/createFunction'
import JSZip from 'jszip'
import { getFunctionCode } from '@apis/getFunctionCode'

// import { getFunctionVersionList } from '@apis/getFunctionVersionList'

export function useFunction(appId: string, functionType: FuncType) {
  const [func, setFunc] = useState<Func>()
  const [code, setCode] = useState<string>()
  const [codeZip, setCodeZip] = useState<File | null>(null)
  // const [versionList, setVersionList] = useState<FunctionVersion[]>([])
  // const [selectedVersionId, setSelectedVersionId] = useState<string>('$LATEST')
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(true)

  useEffect(() => {
    getFunction(appId, functionType).then((data) => {
      setFunc(data)
    }).catch((error) => {
      alert('Failed to get function or code ' + JSON.stringify(error))
    })

    // loadFunctionVersionList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId, functionType])

  useEffect(() => {
    setIsCodeLoading(true)
    getFunctionCode(appId, functionType, '$LATEST').then((res) => {
      setIsCodeLoading(false)
      if (res.data.byteLength === 0) {
        setCode(defaultCode)
        setCodeZip(null)
        return
      }
      const zip = new JSZip()
      zip.loadAsync(res.data).then((zipData) => {
        const indexJS = zipData.files['index.js']
        if (indexJS) {
          indexJS.async('text').then(async(indexJSData) => {
            setCode(indexJSData)

            // Convert JSZip object to File object
            const content = await zip.generateAsync({ type: 'uint8array' })
            const blob = new Blob([content], { type: 'application/zip' })
            const fileName = 'code.zip'
            const file = new File([blob], fileName)

            setCodeZip(file)
          })
        } else {
          setCode('')
          setCodeZip(null)
        }
      })
    })
  }, [appId, functionType])

  function saveFunc(savingFunc: Func, zip?: Blob) {
    if (!func) {
      throw new Error('function is not read yet.')
    }
    setFunc(savingFunc)
    if (Object.keys(savingFunc).length > 0 && zip) {
      if (Object.keys(func).length > 0) {
        return updateFunction(appId, functionType, savingFunc, zip)
      } else {
        return createFunction(appId, functionType, savingFunc, zip)
      }
    } else {
      return deleteFunction(appId, functionType)
    }
  }

  return {
    func,
    code,
    codeZip,
    saveFunc,
    isCodeLoading,
  }
}

const defaultCode = `exports.handler = async (args) => {
  //This is a sample function, please replace it with your own code
  console.log('Arguments:', JSON.stringify(args));
}`
