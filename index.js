// Importing the libraries
const express = require('express');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const cors = require('cors');


// MongoDB connection
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PW}@mongodb-svc:27017/admin`, 
    {useNewUrlParser: true})  
    .then(() => {
      console.log('Connected to MongoDB cluster');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB cluster:', error);
    });


// Define the URL schema for variables
const urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortenedURL: {
    type: String,
    required: true,
    unique: true,
  },
});


// Define the MongoDB model
const URL = mongoose.model('test', urlSchema);

// Configuring the express server
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Post API request for /shorten path
app.post('/shorten', async (req, res) => {
    const { url } = req.body;
    const shortenedURL = generateShortURL();
    try {
      // Save the original URL and shortened URL in the database
      await URL.create({ originalURL: url, shortenedURL });
  
      res.json({ shortenedURL });
    } catch (error) {
      //console.error('Error saving URL to the database:', error);
      res.status(500).json({ error: 'Failed to shorten URL' });
    }
  });


  // Post GET request for /reverse/:shortURL path, example /shorten/dsfsafsaf
  app.get('/reverse/:shortURL', async (req, res) => {
    const { shortURL } = req.params;
  
    try {
      // Retrieve the original URL from the database
      const url = await URL.findOne({ shortenedURL: shortURL });
  
      if (!url) {
        res.status(404).json({ error: 'Shortene d URL not found' });
        return;
      }
  
      res.json({ originalURL: url.originalURL });
    } catch (error) {
      console.error('Error retrieving URL from the database:', error);
      res.status(500).json({ error: 'Failed to retrieve URL' });
    }
  });

  
  // Generate the HASH key from nanoid import function
  function generateShortURL() {
    return nanoid(8);
  }


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} also the username and password is ${process.env.DB_USER}:${process.env.DB_PW}`);
});
