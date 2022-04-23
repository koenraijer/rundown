
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/`;

export async function post({ request }) {
    const {token} = await fetch('https://www.koenraijer.io/api/access_token.json').then(res => res.json())

    const params_obj = await request.text().then(res => new URLSearchParams(res)) // https://github.com/sveltejs/kit/pull/3384 (request.text() since I provided it as a string already)
    const type = params_obj.get('type')
    params_obj.delete('type')
    const url = TOP_TRACKS_ENDPOINT + type + '?' + params_obj.toString()

    const data = await fetch(url, {
      headers: {
      Authorization: `Bearer ${token}`
      },
    }).then(res => res.json())
    
  return {
    status: 200,
    body: { data },
  }
}

