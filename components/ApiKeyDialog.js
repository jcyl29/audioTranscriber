import React, { useRef, useEffect } from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import { useApp } from '../appContext.js'

const html = htm.bind(React.createElement)

const ApiKeyDialog = () => {
  const { setApiKey } = useApp()
  const dialogRef = useRef()
  const formRef = useRef()

  const handleKeyDown = (e) => {
    if (e.key !== 'Escape') return
    const apiKey = formRef.current.elements.namedItem('api-key').value.trim()
    if (!apiKey) {
      // don't close dialog if nothing entered
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    const apiKey = localStorage.getItem('apiKey')
    if (!apiKey) {
      dialogRef.current.showModal()
    } else {
      setApiKey(apiKey)
      dialogRef.current.close()
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const apiKey = e.target.elements.namedItem('api-key').value.trim()
    if (!apiKey) {
      return
    }

    localStorage.setItem('apiKey', apiKey)
    setApiKey(apiKey)
    dialogRef.current.close();
  }

  return html` <dialog ref=${dialogRef} className="dialog">
    <form onSubmit=${onSubmit} ref=${formRef}>
      <h2>Enter Deepgram API key</h2>
      <input
        type="text"
        placeholder="Paste API key and hit Enter"
        name="api-key"
      />
    </form>
  </dialog>`
}

export default ApiKeyDialog
