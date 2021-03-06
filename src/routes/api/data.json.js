
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/`;
const redirect_uri = "http://localhost:3000/login"

export async function post({ request }) {
    const {access_token, expires_in, expires_at} = await fetch(redirect_uri).then(res => res.json())

    const params_obj = await request.text().then(res => new URLSearchParams(res)) // https://github.com/sveltejs/kit/pull/3384 (request.text() since I provided it as a string already)
    const type = params_obj.get('type')
    params_obj.delete('type')
    const url = TOP_TRACKS_ENDPOINT + type + '?' + params_obj.toString()

    const data = await fetch(url, {
      headers: {
      Authorization: `Bearer ${access_token}`
      },
    }).then(res => res.json())
    
  return {
    status: 200,
    body: { data },
  }
}

