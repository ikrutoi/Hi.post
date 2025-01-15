import { useState } from 'react'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import './DraftEditor.scss'

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      placeholder="Hi..."
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
    />
  )
}

export default DraftEditor
