var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/response', (req, res) => {
  try{
    res.render('index');
  }
  catch(err)
  {
    console.log(err);
  }
});


router.post('/upload',(req,res) => {
  //************************************* GOOGLE API CALL ************************************* */

  /*Requires env variable : export GOOGLE_APPLICATION_CREDENTIALS="/Users/Galactica/Desktop/Projects/hack_for_good/My_First_Project-950bc161e559.json"*/

  // Imports the Google Cloud client library
  
  const speech = require('@google-cloud/speech');
  const fs = require('fs');

  // Your Google Cloud Platform project ID
  const projectId = 'decent-tape-224418';

  // Creates a client
  const client = new speech.SpeechClient({
    projectId: projectId,
  });


  // Reads a local audio file and converts it to base64
  const file = req.files;
  console.log(file);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    //sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});


module.exports = router;
