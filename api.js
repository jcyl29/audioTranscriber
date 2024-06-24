const BASE_URL = 'https://api.deepgram.com/v1/listen'
const getTranscriptFromFile = async (apiKey, fileAsObjUrl, options = {}) => {
  const { model = 'nova-2', smartFormat = true, diarize = false } = options
  const url = new URL(BASE_URL)
  url.searchParams.append('model', model)
  url.searchParams.append('smart_format', smartFormat.toString())
  url.searchParams.append('diarize', diarize.toString())

  const fileResp = await fetch(fileAsObjUrl)
  const file = await fileResp.blob()

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'audio/wav',
    },
    body: file,
  })
  return await processResponse(resp)
}

const processResponse = async (response) => {
  // handle not ok errors
  const respData = await response.json()
  const resp = {
    ok: response.ok,
    transcript: null,
    errorMessage: null,
  }

  if (response.ok) {
    const alternatives = respData.results.channels[0].alternatives[0]
    if (alternatives.confidence === 0) {
      Object.assign(resp, {
        ok: false,
        errorMessage: 'Could not transcribe the audio -- is it in English?',
      })
    }
    if (alternatives?.paragraphs?.transcript) {
      resp.transcript = alternatives.paragraphs.transcript
    } else {
      resp.transcript = alternatives.transcript
    }
  } else {
    Object.assign(resp, {
      errorMessage: respData.err_msg,
    })
  }

  return resp
}

export { getTranscriptFromFile }
