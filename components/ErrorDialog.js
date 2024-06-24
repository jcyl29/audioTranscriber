import React, {
  useRef,
  useEffect,
} from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import { useApp } from '../appContext.js'

const html = htm.bind(React.createElement)

const ErrorDialog = () => {
  const { setOpenErrorDialog, openErrorDialog, errorDialogCopy } = useApp()
  const dialogRef = useRef()

  // listen for changes to openErrorDialog state
  useEffect(() => {
    if (openErrorDialog) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [openErrorDialog])

  const onClose = () => {
    setOpenErrorDialog(false)
  }

  return html` <dialog ref=${dialogRef} className="dialog">
    <h2>⚠️ There was a problem with the upload</h2>
    <h4>See error message:</h4>
    <p>${errorDialogCopy}</p>
    <footer>
      <button className="button" onClick=${onClose}>Close</button>
    </footer>
  </dialog>`
}

export default ErrorDialog
