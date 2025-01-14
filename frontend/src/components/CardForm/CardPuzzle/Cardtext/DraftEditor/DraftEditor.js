import React, { useState } from 'react'
import { Editor, EditorState } from 'draft-js'
// import 'draft-js/dist/Draft.css'
import './DraftEditor.scss'

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )

  return (
    // <>
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      // className="draft-editor"
      blockStyleFn={() => ({
        style: {
          border: '1px solid #ccc',
          padding: '10px',
          minHeight: '100px',
          backgroundColor: '#f9f9f9',
          fontFamily: 'Arial, sans-serif',
        },
      })}
    />
    // {/* </> */}
    // <div
    // style={{ border: '1px solid black', padding: '10px', minHeight: '100px' }}
    // >
    // {/* </div> */}
  )
}

export default DraftEditor
