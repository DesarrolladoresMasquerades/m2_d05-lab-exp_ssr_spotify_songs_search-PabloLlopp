require('dotenv').config();

const express = require('express');
const res = require('express/lib/response');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/artist-search-results', (req, res)=>{
    const searchArtist = req.query.searchArtist;
    spotifyApi
  .searchArtists(searchArtist)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    //console.log("KIKI: ", data.body.artists.items[0])
    //const image = data.body.artists.items[0].images[0].url
    res.render('artist-search-results', {artist: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res)=>{
  const id = req.params.id;
  spotifyApi
  .getArtistAlbums(id)
  .then(data => {
    res.render('albums', {albums:data.body.items})
    console.log('Albums information', {albums:data.body.items});
  }, function(err) {
    console.error(err);
  });
})

app.get('/tracks/:idTrack', (req, res) => {
  const idTrack = req.params.idTrack;
  
  spotifyApi
  .getAlbumTracks(idTrack)
  .then((data) => {
    console.log('tracks data' ,data)
        res.render('tracks', {tracks: data.body.items} );

        console.log('tracks', tracks)
})
.catch((err) => console.log(err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

