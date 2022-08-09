// appel de express
const express = require('express');
// constante app qui sera notre application; ça permet de créer une application express
const app = express();
// appel de helmet, utilisé pour sécuriser les en-têtes http.
const helmet = require("helmet");
// on importe path qui donne accès au chemin du système de fichiers
const path = require('path');
//
const bodyParser = require('body-parser');
//protège des attaques par injection
const mongoSanitize = require('express-mongo-sanitize');
// appel de dotenv qui stocke des variables d'environnement et ça servira pour l'appel mongodb en dessous.
require("dotenv").config({ path: "./config/.env" });
// appel du fichier de mongodb qui permet la connection à mongodb
require("./config/mgdb");
// middleware d'helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//----------------------------------------------------------------------------------
// CORS
//----------------------------------------------------------------------------------
// Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
// Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse
// middleware général ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes et sera appliqué à toutes les requetes envoyées au serveur
app.use((req, res, next) => {
    // origine, droit d'accéder c'est tout le monde '*'
    res.setHeader("Access-Control-Allow-Origin", '*');
    // headers, ce sont les headers acceptés (en-tête)
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    // methods,  ce sont les méthodes acceptés (verbe de requete)
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
});
// middleware intercepte la requete et la transforme au bon format     
app.use(express.json());

//les routes
const userRoutes = require("./routes/user.routes");



app.use("/api/auth", userRoutes);
//

// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app;