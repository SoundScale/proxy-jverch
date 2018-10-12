require('newrelic');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors')
const axios = require('axios');
const compression = require('compression')
const port = 3000;

const app = express();

app.use(compression());

app.use(cors());

app.use(morgan('dev'));

app.use('/songs/:id', express.static('public'));

app.get('/:id', (req, res) => {
  res.send('I HAVE REACHED THE PROXY  params->  ' + req.params.id);
})

app.get('/api/waveformplayer/:id', (req, res) => {
  // console.log("proxy server sent a GET request to /api/waveformplayer/:id");
  axios(`${process.env.LB_HOST}/api/waveformplayer/${req.params.id}`)
    .then(function (response) {
      res.send(response.data)
    })
    .catch(function (error) {
      console.log(error);
    })
  });

app.get('/relatedTracks/:id', (req, res) => {
  // res.send(req.params.id)
  const songId = req.params.id;
  axios.get(`http://18.219.127.175/relatedTracks/${songId}`)
    .then(({ data }) => {
      console.log('Related Tracks', data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/relatedAlbums/:id', (req, res) => {
  const songId = req.params.id;
  axios.get(`http://18.219.127.175/relatedAlbums/${songId}`)
    .then(({ data }) => {
      console.log('Related Albums', data);
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/api/stats/:id', (req, res) => {
  axios.get(`http://sdc-load-balancer-1743830225.us-west-1.elb.amazonaws.com/api/stats/${req.params.id}`)
    .then(({ data }) => {
      res.json(data);
    })
    .catch((error) => {
      console.log(error);
    })
})

app.get('/api/comments/:id', (req, res) => {
  axios.get(`http://SoundScale-Comments-LB-513047902.us-west-1.elb.amazonaws.com/api/comments/${req.params.id}`)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});