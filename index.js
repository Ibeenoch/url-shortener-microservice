import express from 'express'
import cors from 'cors';
import path from 'path';
import dns from 'dns';
import { connectDb } from './config/db.js';
import dotenv from 'dotenv';
import Url from './model/url.js';
dotenv.config();

const __dirname = path.resolve()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
connectDb();

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  
  const urlInput = new URL(req.body.url);
  const hostname = urlInput.hostname;
  // console.log(urlInput, hostname)
  const dnslookup = dns.lookup(hostname, async(err, address, family) => {
   if(err){
    console.log('error ')
    res.json({ error: 'invalid url' })
   }else{
    console.log('okay', hostname)
    const url = await Url.create({
      original_url: req.body.url,
      short_url: await Url.countDocuments()
    });
    console.log(url)
    res.status(201).json({
      original_url: url.original_url,
      short_url: url.short_url,
     })
   }

  })
})

app.get('/api/shorturl/:short_url', async(req, res) => {
  const { short_url } = req.params;
  const url = await Url.findOne({
    short_url
  });
console.log('redirect', url.original_url)
    res.redirect(url.original_url)

})

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
