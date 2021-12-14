import * as functions from "firebase-functions";
import * as express from "express";
import {composeTweet, getAllTweets} from "./Controller/tweetController";

const App = express();

App.get("/", (req, res) => res.status(200).send("Hello there...."));
App.post("/tweets", composeTweet);
App.get("/tweets", getAllTweets);

exports.App = functions.https.onRequest(App);


