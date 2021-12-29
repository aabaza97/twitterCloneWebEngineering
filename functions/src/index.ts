import * as functions from "firebase-functions";
import * as express from "express";
import {composeTweet, getAllTweets} from "./Controller/tweetController";
import {createUser} from './Controller/userController'
import * as cors from "cors";


const App = express();
const corsHandler = cors({origin: true});
App.use(express.json())

App.get("/", (req, res) => res.status(200).send("Hello there...."));
App.post("/tweets", composeTweet);
App.get("/tweets", getAllTweets);
App.post('/user', createUser)
App.use(corsHandler);

exports.App = functions.https.onRequest(App);


