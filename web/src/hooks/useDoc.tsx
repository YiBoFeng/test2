import { useState } from 'react'
import { CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import DocModal from '@components/doc/DocModal.tsx'

export default function useDoc() {
  const [showDoc, setShowDoc] = useState(false)

  const docListButton: CommonAppBarMenu = {
    title: 'DOC',
    onClick: () => {
      setShowDoc(true)
    },
  }
  const docModal = <DocModal open={showDoc} onClose={() => setShowDoc(false)} />
  return { docListButton, docModal }
}