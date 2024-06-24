import React from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import { useApp } from '../appContext.js'
import {
  bytes2MegaBytes,
  createTextBlobAsObjectUrl,
  formatDuration,
  getDownloadAttrsForLink,
} from '../helpers.js'
import { getTranscriptFromFile } from '../api.js'

const html = htm.bind(React.createElement)

const DEFAULT_ROWS = 5

const MainTable = () => {
  const {
    apiKey,
    rows,
    setRows,
    setTranscriptViewerKey,
    setOpenErrorDialog,
    setErrorDialogCopy,
  } = useApp()

  const updateRowById = (id, newData) => {
    setRows((rows) => {
      return {
        ...rows,
        [id]: {
          ...rows[id],
          ...newData,
        },
      }
    })
  }

  const onTranscribe = async (evt, id) => {
    evt.preventDefault()
    const { transcript, fileAsObjUrl, customModel } = rows[id]

    if (!transcript) {
      updateRowById(id, { transcriptFetching: true })
      const transcriptResp = await getTranscriptFromFile(apiKey, fileAsObjUrl, {
        diarize: rows[id].diarized,
        model: customModel || 'nova-2',
      })
      if (transcriptResp.ok) {
        updateRowById(id, {
          transcript: transcriptResp.transcript,
          transcriptAsObjUrl: createTextBlobAsObjectUrl(
            transcriptResp.transcript
          ),
          transcriptFetching: false,
        })
        setTranscriptViewerKey(id)
      } else {
        setOpenErrorDialog(true)
        setErrorDialogCopy(transcriptResp.errorMessage)
        updateRowById(id, { transcriptFetching: false })
        return
      }
    }

    // show existing transcript
    setTranscriptViewerKey(id)
  }

  // non empty spaces: https://github.com/developit/htm/issues/234
  const drawEmptyRow = () =>
    html` <tr>
      <td colSpan="4">${'\xA0'}</td>
    </tr>`

  const drawTranscribeAction = ({ key, transcript, transcriptFetching }) => {
    let text = 'Transcribe'
    let onClick = (e, key) => onTranscribe(e, key)
    if (transcriptFetching) {
      text = 'Please wait...'
      onClick = (e) => {
        e.preventDefault()
      }
    } else if (transcript) {
      text = 'View transcript'
    }

    return html` <a className="label" href="#" onClick=${(e) => onClick(e, key)}
      >${text}</a
    >`
  }

  const onDiarizeToggle = (e) => {
    updateRowById(e.target.closest('tr').dataset.rowId, {
      diarized: e.target.checked,
    })
  }

  const drawDownloadAction = ({ name, transcriptAsObjUrl }) => {
    if (transcriptAsObjUrl) {
      return html`<a
        className="label"
        href="#"
        ...${getDownloadAttrsForLink(name, transcriptAsObjUrl)}
        >Download</a
      >`
    }

    return html`<span className="gray-text label">Download</span>`
  }

  const drawModelOptions = () => {
    return html`<select
      onChange=${(e) => {
        const key = e.target.closest('tr').dataset.rowId
        updateRowById(key, { customModel: e.target.value })
      }}
    >
      <option value="">Choose a different model..</option>
      <option value="nova-2-meeting">nova-2-meeting</option>
      <option value="nova-2-phonecall">nova-2-phonecall</option>
      <option value="nova-2-finance">nova-2-finance</option>
      <option value="nova-2-conversationalai">nova-2-conversationalai</option>
      <option value="nova-2-voicemail">nova-2-voicemail</option>
      <option value="nova-2-video">nova-2-video</option>
      <option value="nova-2-medical">nova-2-medical</option>
      <option value="nova-2-drivethru">nova-2-drivethru</option>
      <option value="nova-2-automotive">nova-2-automotive</option>
    </select>`
  }

  const drawRowWithData = ({
    key,
    name,
    duration,
    sizeInBytes,
    transcript,
    transcriptFetching,
    transcriptAsObjUrl,
  }) => {
    return html` <tr key="${key}" data-row-id="${key}">
      <td className="truncate">${name}</td>
      <td>${formatDuration(duration)}</td>
      <td>${bytes2MegaBytes(sizeInBytes)} MB</td>
      <td><input type="checkbox" onChange=${onDiarizeToggle} /></td>
      <td>${drawModelOptions()}</td>
      <td>${drawTranscribeAction({ key, transcript, transcriptFetching })}</td>
      <td>${drawDownloadAction({ name, transcriptAsObjUrl })}</td>
    </tr>`
  }

  const drawDataRows = Object.entries(rows).map(([key, values]) => {
    return drawRowWithData({ key, ...values })
  })

  const drawRemainingRows = [
    ...Array(
      DEFAULT_ROWS - drawDataRows.length < 0
        ? 0
        : DEFAULT_ROWS - drawDataRows.length
    ),
  ].map(() => drawEmptyRow())

  const drawTotalRows = [...drawDataRows, ...drawRemainingRows]

  return html` <table className="table">
    <thead className="thead">
      <tr>
        <th className="table-header">filename</th>
        <th className="table-header">duration</th>
        <th className="table-header">size</th>
        <th className="table-header">Diarize?</th>
        <th className="table-header">Model</th>
        <th className="table-header"></th>
        <th className="table-header"></th>
      </tr>
    </thead>
    <tbody>
      ${drawTotalRows}
    </tbody>
  </table>`
}

export default MainTable
