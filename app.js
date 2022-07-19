require("dotenv").config();

const { query } = require("express");
const express = require("express");
const hbs = require("hbs");


// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

// Iteration 3 | Search for an Artist
app.get("/artist-search", (req, res, next) => {
  const { name } = req.query;
  //console.log(req.query)
    spotifyApi
      .searchArtists(name)
      .then((data) => {
        const artist = data.body.artists.items;
        //console.log(artist)
        res.render("artist-search-results", { artist });
      })
      .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
      );
});


// Iteration 4 | View Albums
app.get('/albums/:artistId', (req, res, next) => {
  const { artistId } = req.params;
   console.log(req.params)
  spotifyApi
  .getArtistAlbums(artistId)
  .then((data) => {
    const album = data.body.items;
    console.log(album)
    res.render("albums", { album });
  })
  .catch((err) =>
    console.log("The error while searching albums occurred: ", err)
  );
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
