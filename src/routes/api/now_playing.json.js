const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;
const redirect_uri = "http://localhost:3000/"
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export async function get() {
  const {token} = await fetch('https://www.koenraijer.io/api/access_token.json').then(res => res.json())
  
  const res = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
    Authorization: `Bearer ${token}`
    }
  })
  
  if (res.status === 204 || res.status >= 400) { // Spotify returns 204 when there's nothing playing
    return {
      status: 200,
      body: { isPlaying: false }}
  } 
  

  const song = await res.json();

  const progress_ms = song.progress_ms
  const duration_ms = song.item.duration_ms
  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return {
    body: {title, artist, album, isPlaying, albumImageUrl, songUrl, duration_ms, progress_ms},
  }
}

