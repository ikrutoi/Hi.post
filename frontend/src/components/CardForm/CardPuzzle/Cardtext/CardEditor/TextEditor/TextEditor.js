import './TextEditor.scss'

const TextEditor = ({ value }) => {
  console.log('editor', value[0].children[0].text)
  return <div>{value[0].children[0].text}</div>
}

export default TextEditor
