let accessToken = window.localStorage.getItem('accessToken')
const codeParam = (new URL(location)).searchParams.get('code')

if (codeParam) {
  // handle redirect
  window.localStorage.setItem('accessToken', codeParam)
  window.history.pushState({}, document.title, window.location.pathname)
} else if (accessToken === null) {
  // to be auth
  const query = [
    'client_id=4755cf31f5cbc4ad47cf',
    'scope=gist',
  ].join('&')
  const url = `https://github.com/login/oauth/authorize?${query}`
  document.getElementById('auth').setAttribute('href', url)
  document.getElementById('auth').classList.remove('hidden')
} else {
  const config = {
    mode: 'no-cors',
  }
  fetch(`https://us-central1-promise-280303.cloudfunctions.net/auth?code=${accessToken}`, config)
    .then(response => {
      console.log('response', response)
    })
    .catch(error => {
      console.log('error', error)
    })
}
