import {Buffer} from 'buffer'

const client_id = import.meta.env.SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.SPOTIFY_REFRESH_TOKEN;
const redirect_uri = "http://localhost:3000/"
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const song = {};

const getAccessToken = async () => {
const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
    // Authorization: `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: 'AQA8dsZz8-lIf2VlXk2c4sXQLcv_O20qhijWjsS6Qr4ZBV0Mp6bjeV9p8ywEtwGD6BR1jpz1TwcJ9CdEq4vJifywslJQt5pRnBycXmUzOVcNLifrMXQVlwIX1YHSyBPnBZc',
    redirect_uri: "http://localhost:3000/",
    client_id: "6a046c3ef5114c09801a2472891e4753",
    client_secret: "7e67de85b6e540959886511a46ee0663"
    })
});

return response.json();
};

export const getNowPlaying = async () => {
  const { access_token, expires_in } = await getAccessToken();
  console.log(access_token, expires_in)

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
      Authorization: `Bearer ${access_token}`
      }
  });
  console.log(response.status)
  if(response.status === 204 || response.status > 400) {
    return response.status
  } 

  const song = await response.json();

  if(song.item === null) {
    return response.status
  }


  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  console.log("Title: " + title + "\n" + "Artist: " + artist + "\n" + "Album: " + album)
  return {title, artist, album, isPlaying, albumImageUrl, songUrl}

};

export const getTopTracks = async () => {
const { access_token } = await getAccessToken();

const res = await fetch(TOP_TRACKS_ENDPOINT, {
  headers: {
  Authorization: `Bearer ${access_token}`
  }
});

  const top_tracks = await res.json();

  return top_tracks.items;
};

/*
https://accounts.spotify.com/authorize?client_id=6a046c3ef5114c09801a2472891e4753&response_type=code&redirect_uri=http
%3A%2F%2Flocalhost:3000&scope=user-read-currently-playing%20
user-top-read

# Authorization_code
AQA9CH6o-ZhieTCA70X0MlvcBgu_8N9q0nn3_w1EJUAtW-Xn-OfEAz4OZ6b7kbrzojqLNQvDVGYi0GRP5RTvzEghUHO1A20V9RmOtN53hkV-RLiY3kkEeZvT4pzoqsQu5gpqIX-E6hECOZ73D04wLKHdIr3fZvblPaGLnh4l_crmpPiulGd09kBTjd62WcJhT0W_hNWjjIrdcIh3-6X5ZR9lAr62

clientid:clientsecret Base64
NmEwNDZjM2VmNTExNGMwOTgwMWEyNDcyODkxZTQ3NTM6N2U2N2RlODViNmU1NDA5NTk4ODY1MTFhNDZlZTA2NjM=

curl -H "Authorization: Basic NmEwNDZjM2VmNTExNGMwOTgwMWEyNDcyODkxZTQ3NTM6N2U2N2RlODViNmU1NDA5NTk4ODY1MTFhNDZlZTA2NjM=" -d grant_type=authorization_code -d code=AQA9CH6o-ZhieTCA70X0MlvcBgu_8N9q0nn3_w1EJUAtW-Xn-OfEAz4OZ6b7kbrzojqLNQvDVGYi0GRP5RTvzEghUHO1A20V9RmOtN53hkV-RLiY3kkEeZvT4pzoqsQu5gpqIX-E6hECOZ73D04wLKHdIr3fZvblPaGLnh4l_crmpPiulGd09kBTjd62WcJhT0W_hNWjjIrdcIh3-6X5ZR9lAr62 -d redirect_uri=http%3A%2F%2Flocalhost:3000 https://accounts.spotify.com/api/token

{"access_token":"BQD-xpD90QWVwh2t4-xDvHA2zRncogPW-bdaFiuPdFOIdPP0Q4_XdR1fFXHD5d8XyFYJ0AWeR9indw7UAHiCDwkjSf8_E8VXT9RfkNf7Df8F2MqZVuH07-F9rhb4TMbXnJSqVH42uMfVcqrXJSPQDzD7Jr0","token_type":"Bearer","expires_in":3600,"refresh_token":"AQA8dsZz8-lIf2VlXk2c4sXQLcv_O20qhijWjsS6Qr4ZBV0Mp6bjeV9p8ywEtwGD6BR1jpz1TwcJ9CdEq4vJifywslJQt5pRnBycXmUzOVcNLifrMXQVlwIX1YHSyBPnBZc","scope":"user-read-currently-playing user-top-read"}
*/

/*
Get access token example: https://github.com/pckkkkkk/sveltekit-spotify/blob/master/src/lib/api.js 

*/