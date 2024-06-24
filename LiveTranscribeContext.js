import React, { useContext, useState } from 'https://esm.sh/react@18.3.1?dev'

const LiveTranscribeContext = React.createContext()
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

function LiveTranscribeProvider({ children }) {
  const [rows, setRows] = useState({})
  const value = {
    rows,
    setRows
  }
  return html` <${LiveTranscribeContext.Provider} value=${value}>${children}<//>`
}

function useLiveTranscribe() {
  const context = useContext(LiveTranscribeContext)
  if (context === undefined) {
    throw new Error('useApp must be used within a LiveTranscribeProvider')
  }
  return context
}

export { LiveTranscribeProvider, useLiveTranscribe }
