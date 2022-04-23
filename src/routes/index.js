// Server-side redirects: https://dev.to/danawoodman/how-to-redirect-in-sveltekit-endpoints-1im3

const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const redirect_uri = "https://rundown-ruddy.vercel.app"
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
let acc_token;
let expires_at;
let time_left;

export async function get({ url }) {
    let params = url.href.toString().split('?')[1]; // split creates an array of 2 strings, and we need the string at index [1]
    const code = new URLSearchParams(params).get('code')

    // Check if there's a token already, and whether it is still valid
    if(acc_token && expires_at > Date.now()) {
      return {
          status: 200,
          body: {access_token: acc_token, expires_in: time_left, expires_at: expires_at}
      }
    }

    const { access_token, expires_in, refresh_token } = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
        // Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri,
          client_id,
          client_secret,
        })
    }).then(res => res.json());

      acc_token = access_token
      time_left = expires_in
      expires_at = Date.now() + (expires_in * 1000) // expires_in is in seconds, while Date.now() is in milliseconds

      return {
          status: 200,
          body: {access_token: acc_token, expires_in: expires_in, expires_at: expires_at }
      }   
}

   