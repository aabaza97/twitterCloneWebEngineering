import * as functions from "firebase-functions";
import * as express from "express";
import {composeTweet, getAllTweets} from "./Controller/tweetController";
import * as cors from "cors";

const App = express();
const corsHandler = cors({origin: true});


App.get("/", (req, res) => res.status(200).send("Hello there...."));
App.post("/tweets", composeTweet);
App.get("/tweets", getAllTweets);
App.use(corsHandler);

exports.App = functions.https.onRequest(App);


