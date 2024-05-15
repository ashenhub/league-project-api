var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
require('dotenv').config();

var app = express();
app.use(cors());

var DBNAME = "LeagueProject";
var database;

app.listen(8080, () => {
    MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
      database = client.db(DBNAME);
      console.log("Connected to database");
    });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Gallery API!');
});

app.get('/api/gallery/getGallery', (req, res) => {
  database.collection("gallery").find({}).toArray((err, data) => {
    res.send(data);
  });
});

app.put('/api/gallery/addScore/:skinID', (req, res) => {
  const skinID = Number(req.params.skinID);

  // Verificar que el ID de la skin sea válido
  database.collection("gallery").findOne({ skinID: skinID }, (err, skin) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving skin from database");
      return;
    }

    if (!skin) {
      res.status(404).send(`Skin with ID ${skinID} not found`);
      return;
    }

    // Se incrementa el score de la skin
    const updatedScore = skin.score + 1;
    database.collection("gallery").updateOne({ skinID: skinID }, { $set: { score: updatedScore } }, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating score in database");
        return;
      }
      
      console.log(`Skin ${skinID} updated with score ${updatedScore}`);
      res.send(result);
    });
  });
});
