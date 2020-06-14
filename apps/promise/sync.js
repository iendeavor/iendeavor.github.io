let accessToken = window.localStorage.getItem('accessToken')

if (accessToken === null) {
  console.log(1)
  // to be auth
  const query = [
    'client_id=4755cf31f5cbc4ad47cf',
    'scope=gist',
    'redirect_uri=https://us-central1-promise-280303.cloudfunctions.net/auth',
  ].join('&')
  const url = `https://github.com/login/oauth/authorize?${query}`
  document.getElementById('auth').setAttribute('href', url)
  document.getElementById('auth').classList.remove('hidden')
} else if (location.searchParams.get('code')) {
  console.log(2)
  // handle redirect
  window.localStorage.setItem('accessToken', location.url.searchParams.get('code'))
  location.reload()
} else {
  console.log(3)
  fetch('https://api.github.com/user')
    .then(response => {
      console.log('response', response)
    })
    .catch(error => {
      console.log('error', error)
    })
}
