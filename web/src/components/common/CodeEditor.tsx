import Editor from '@monaco-editor/react'
import { useCallback } from 'react'

type Props = {
  readOnly: boolean
  language: string
  code: string | undefined
  showLineNumbers?: boolean
  onChange: (code: string | undefined) => void
  onValidate?: (valid: boolean) => void
}
export function CodeEditor({
  readOnly,
  language,
  code,
  showLineNumbers = true,
  onChange,
  onValidate,
}: Props) {
  const onValidateCallback = useCallback(
    (marker: string | unknown[]) => {
      onValidate && onValidate(marker.length === 0)
    },
    [onValidate],
  )
  return (
    <Editor
      language={language}
      value={code}
      onChange={onChange}
      onValidate={onValidateCallback}
      options={{
        readOnly: readOnly,
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        hideCursorInOverviewRuler: true,
        lineDecorationsWidth: 0,
        padding: {
          top: 1,
          bottom: 1,
        },
        lineNumbers: showLineNumbers ? 'on' : 'off',
      }}
    />
  )
}
