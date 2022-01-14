import * as functions from "firebase-functions";
import * as express from "express";
import {bookmarkTweet, composeTweet, deleteTweet, dislikeTweet, getAllTweets, getTweet, getTweetReplies, getUserBookmarks, getUserTweets, likeTweet, replyToTweet, retweetTweet, unmarkTweet} from "./Controller/tweetController";
import {createUser} from "./Controller/userController";
import * as cors from "cors";
const mediaToURL = require('./middleware/mediaToURL');

const App = express();
const corsHandler = cors({origin: true});
App.use(express.json());

App.get("/", (req, res) => res.status(200).send("Hello tweeter ;p"));
App.post("/tweets", composeTweet);
App.get("/tweets", getAllTweets);
App.delete("/tweets/:id", deleteTweet);
App.get("/tweet/:id", getTweet);
App.get("/profile/:id", getUserTweets);
App.post("/reply/:tweetId", replyToTweet);
App.post("/retweet/:tweetId", retweetTweet);
App.get("/replies/:tweetId", getTweetReplies);
App.post("/like/:tweetId", likeTweet);
App.delete("/like/:tweetId", dislikeTweet);
App.post("/bookmark/:tweetId", bookmarkTweet);
App.delete("/bookmark/:tweetId", unmarkTweet);
App.get("/bookmark/:userId", getUserBookmarks);


App.post("/user", mediaToURL, createUser);
App.use(corsHandler);

exports.App = functions.https.onRequest(App);


