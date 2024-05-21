const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para analizar cuerpos JSON

const MONGODB_CONNECTION = process.env.MONGODB_URI + "?ssl=true&retryWrites=true&w=majority";
const DBNAME = "LeagueProject";
let database;

MongoClient.connect(MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to the database. ', err);
        process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
    }
    database = client.db(DBNAME);
    console.log("Connected to database");

    // Start the server after the database connection is established
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.get('/api/gallery/getGallery', (req, res) => {
    database.collection("gallery").find({}).toArray((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(data);
        }
    });
});

app.put('/api/gallery/addScore/:skinID', (req, res) => {
    const skinID = parseInt(req.params.skinID);
    const newScore = req.body.score;

    database.collection("gallery").updateOne({ skinID: skinID }, { $set: { score: newScore } }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(`Skin ${skinID} updated with score ${newScore}`);
            res.send(result);
        }
    });
});
