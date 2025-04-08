// import Typography from '@mui/material/Typography'
// import { useEffect, useMemo, useState } from 'react'
// import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material'
// import { cloneDeep, get, isArray, isObject } from 'lodash'
// import { Code } from '../common/Code'

// export default function DataPicker({ obj, setJsCodeFromPicker }) {
//   let [options, setOptions] = useState([])
//   let [cloneObject, setCloneObject] = useState({})
//   let [isArraySelected, setIsArraySelected] = useState(false)
//   let [availableKeys, setAvailableKeys] = useState([])
//   let [navigation, setNavigation] = useState('')
//   let [objectKey, setObjectKey] = useState('')
//   let [objectValue, setObjectValue] = useState('')
//   let [getCode, setGetCode] = useState('let result = body')
//   let [arrayNavigation, setArrayNavigation] = useState(['', ''])
//   useEffect(()=>{
//     let result = Object.keys(cloneObject).map(key=>{
//       let object = cloneObject[key]
//       return {
//         value: key,
//         label: key,
//         type: typeof object === 'object'?isArray(object)?'array':'object': typeof object,
//         disabled: isArraySelected? (isArray(object) || !isObject(object)) : typeof object !== 'object',
//       }
//     })
//     setOptions(result)
//   }, [cloneObject])
//   useEffect(()=>{
//     setCloneObject(cloneDeep(obj))
//   }, [])
//   useEffect(()=>{
//     if (isArraySelected) {
//       setAvailableKeys(Object.keys(cloneObject).filter(key=>{
//         return typeof cloneObject[key] !== 'object'
//       }))
//     }
//   }, [cloneObject, isArraySelected])
//   let output = useMemo(()=>{
//     if (objectKey && objectValue) {
//       return [{
//         label: get(obj, navigation.replace(/^\./, '') + `.${objectValue}`),
//         value: get(obj, navigation.replace(/^\./, '') + `.${objectKey}`),
//       }]
//     }
//   }, [objectKey, objectValue, navigation, obj])
//   useEffect(()=>{
//     if (objectKey && objectValue) {
//       let fn = `data=>{
//         return {
//           value: data${arrayNavigation[0]}.${objectKey}
//           label: data${arrayNavigation[1]}.${objectValue}
//         }
//       }`
//       setJsCodeFromPicker(getCode.replace('__LOOPFN__', fn))
//     }
//   }, [objectKey, objectValue, getCode, navigation, arrayNavigation])
//   return <>
//     <FormControl>
//       <FormLabel>Pick up a object or array from response</FormLabel>
//       <RadioGroup
//         name="radio-buttons-group"
//         onChange={(event, value)=>{
//           let current = cloneObject[value]
//           let result = []
//           if (isArray(current) && current.length > 0) {
//             setIsArraySelected(true)
//             setCloneObject(current[0])
//             setNavigation(navigation + `.${value}.0`)
//             setGetCode(getCode + `.${value}.map(__LOOPFN__)`)
//           } else if (isObject(current)) {
//             setCloneObject(cloneObject[value])
//             setNavigation(navigation + `.${value}`)
//             if (isArraySelected) {
//               let [k, v] = arrayNavigation
//               setArrayNavigation([k + '.' + value, v + '.' + value])
//             } else {
//               setGetCode(getCode + `.${value}`)
//             }
//           }
//         }}
//       >
//         {options.map(({ label, value, type, disabled })=>{
//           return <FormControlLabel value={value} control={<Radio />} label={`${label} (${type})`} key={value} disabled={disabled} />
//         })}
//       </RadioGroup>
//     </FormControl>
//     {isArraySelected?<div>
//       <div>
//         select label for list:
//         <Select onChange={e=>setObjectValue(e.target.value)}>
//           {availableKeys.map(key=>{
//             return <MenuItem value={key} key={key}>{key}</MenuItem>
//           })}
//         </Select>
//       </div>
//       <div>
//         select value for the list:
//         <Select onChange={e=>setObjectKey(e.target.value)}>
//           {availableKeys.map(key=>{
//             return <MenuItem value={key} key={key}>{key}</MenuItem>
//           })}
//         </Select>
//       </div>
//       <Typography variant="body2" gutterBottom>
//         This API response will yield this array
//       </Typography>
//       {output?<Code obj={output}></Code>:null}
//     </div>:null}
//   </>
// }