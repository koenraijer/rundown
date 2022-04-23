const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;
const redirect_uri = "http://localhost:3000/"
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
let token;
let expires_at;
let time_left;

export const get = async () => {

    // Check if there's a token already, and whether it is still valid
    if(token && expires_at > Date.now()) {
        return {
            status: 200,
            body: {token, time_left}
        }
    }
    const { access_token, expires_in } = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
        // Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        redirect_uri,
        client_id,
        client_secret,
        })
    }).then(res => res.json());

    token = access_token
    time_left = expires_in
    expires_at = Date.now() + (expires_in * 1000) // expires_in is in seconds, while Date.now() is in milliseconds

        return {
            status: 200,
            body: {token, time_left}
        }   
    };
