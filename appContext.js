import React, { useContext, useState } from 'https://esm.sh/react@18.3.1?dev'

const AppContext = React.createContext()
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

function AppProvider({ children }) {
  const [rows, setRows] = useState({})
  const [transcriptViewerKey, setTranscriptViewerKey] = useState('')
  const [openErrorDialog, setOpenErrorDialog] = useState(false)
  const [errorDialogCopy, setErrorDialogCopy] = useState('')
  const [apiKey, setApiKey] = useState('')
  const value = {
    rows,
    setRows,
    transcriptViewerKey,
    setTranscriptViewerKey,
    openErrorDialog,
    setOpenErrorDialog,
    errorDialogCopy,
    setErrorDialogCopy,
    apiKey,
    setApiKey,
  }
  return html` <${AppContext.Provider} value=${value}>${children}<//>`
}

function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}

export { AppProvider, useApp }
