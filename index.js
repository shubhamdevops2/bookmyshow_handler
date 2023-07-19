const express = require('express');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');


// MongoDB connection URI
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PW}@handler-svc:27017/admin`, 
    {useNewUrlParser: true})  
    .then(() => {
      console.log('Connected to MongoDB cluster');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB cluster:', error);
    });
// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Define the URL schema
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

// Create the URL model
const URL = mongoose.model('test', urlSchema);

// Connect to MongoDB cluster
// mongoose.connect(mongoURI, mongoOptions)
//   .then(() => {
//     console.log('Connected to MongoDB cluster');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB cluster:', error);
//   });

var cors = require('cors')

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


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


  app.get('/:shortURL', async (req, res) => {
    const { shortURL } = req.params;
  
    try {
      // Retrieve the original URL from the database
      const url = await URL.findOne({ shortenedURL: shortURL });
  
      if (!url) {
        res.status(404).send('Shortened URL not found');
        return;
      }
  
      res.redirect(url.originalURL);
    } catch (error) {
      console.error('Error retrieving URL from the database:', error);
      res.status(500).json({ error: 'Failed to retrieve URL' });
    }
  });

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
  
  
  function generateShortURL() {
    return nanoid(8);
  }


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} also the username and password is ${process.env.DB_USER}:${process.env.DB_PW}`);
});
