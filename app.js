#!/usr/bin/env node
const express = require('express')
const app = express()

const Lyricist = require('lyricist/node6');
var access_token = "KxuchL6lukY_sdkqc2_PzrqUsXrWRfD-FA8OB6Mmt3LS2_NvTR5P865fAMrgaQxz";
const lyricist = new Lyricist(access_token);

var lyrics = [];

function getArtistData() {
  lyricist.songsByArtist(72, { page: 2, sort: "popularity" }).then((songs) => {
    getSongIds(songs)
  });
}

function getSongIds(objects) {
  var songIds = [];
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].primary_artist.id === 72) {
      songIds.push(objects[i].id);
    }
  }
  fetchSongLyrics(songIds);
}

function fetchSongLyrics(songIds) {
  for (var i = 0; i < songIds.length; i++) {
    lyricist.song(songIds[i], { fetchLyrics: true }).then((song) => {
      var modifiedLyrics = song.lyrics;
      modifiedLyrics = modifiedLyrics.replace(/(\n\n)/g, "");
      modifiedLyrics = modifiedLyrics.replace(/\[[^\]]*\]/g, "");
      lyrics = lyrics.concat(song.lyrics.split("\n"));
    });
  }
}

app.post('/', function (req, res) {
  var rand = Math.floor(Math.random()*(lyrics.length - 1));

  console.log(lyrics);

  res.json({
    "color": "green",
    "message": lyrics[rand] + "\n" + lyrics[rand + 1],
    "notify": false,
    "message_format": "text"
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
  getArtistData();
})
