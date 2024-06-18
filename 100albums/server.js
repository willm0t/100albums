const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize albums array to an empty array every time the server starts
let albums = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/albums', (req, res) => {
    const { albumName, artistName, albumArt } = req.body;
    albums.push({ albumName, artistName, albumArt });
    res.status(201).send('Album added');
});

app.get('/api/albums', (req, res) => {
    res.json(albums);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
