const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

export async function get() {
  const {access_token, expires_in, expires_at} = await fetch(redirect_uri).then(res => res.json())
  
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

