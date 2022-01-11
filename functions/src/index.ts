import * as functions from "firebase-functions";
import * as express from "express";
import {composeTweet, getAllTweets} from "./Controller/tweetController";
import {createUser} from "./Controller/userController";
import * as cors from "cors";
const mediaToURL = require('./middleware/mediaToURL');

const App = express();
const corsHandler = cors({origin: true});
App.use(express.json());

App.get("/", (req, res) => res.status(200).send("Hello there...."));
App.post("/tweets", composeTweet);
App.get("/tweets", getAllTweets);
App.delete("/tweets/:id");
App.get("/tweet/:id");
App.get("/profile/:id");
App.post("/reply/:id");
App.post("/retweet/:id");
App.post("/replies/:id");

App.post("/user", mediaToURL, createUser);
App.use(corsHandler);

exports.App = functions.https.onRequest(App);


