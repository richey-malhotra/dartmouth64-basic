'use client'

import { EditorContainer } from '../../../components/editor/EditorContainer'

export default function EditorPage({
  fontSize,
  setStatus,
}: {
  fontSize?: number
  setStatus?: (status: string) => void
}) {
  return (
    <div className="p-4 h-full">
      <div className="h-full rounded-lg overflow-hidden shadow-lg bg-[#252526]">
        <EditorContainer fontSize={fontSize} setStatus={setStatus} />
      </div>
    </div>
  )
}