import * as functions from "firebase-functions";
import * as express from "express";
import * as Tweet from "./Controller/tweetController";
import * as User from './Controller/userController'
import * as Follows from './Controller/followsController'
import * as cors from "cors";
const passAuth = require('./middleware/passAuth')
const mediaToURL = require('./middleware/mediaToURL');
const authorize = require('./middleware/auth')
const corsHandler = cors({
    origin: true,
    methods:"POST,GET,DELETE,PATCH,PUT"
});
const App = express();

App.use(corsHandler)
App.use(express.json());

App.get("/", (req, res) => res.status(200).send("Hello tweeter ;p"));
App.post("/tweets", mediaToURL, Tweet.composeTweet);
App.get("/tweets", Tweet.getAllTweets);
App.delete("/tweets/:id", Tweet.deleteTweet);
App.get("/tweet/:id", Tweet.getTweet);
App.get("/profile/:id", Tweet.getUserTweets);
App.post("/reply/:tweetId", mediaToURL, Tweet.replyToTweet);
App.post("/retweet/:tweetId", mediaToURL, Tweet.retweetTweet);
App.get("/replies/:tweetId", Tweet.getTweetReplies);
App.post("/like/:tweetId", Tweet.likeTweet);
App.delete("/like/:tweetId", Tweet.dislikeTweet);
App.post("/bookmark/:tweetId", Tweet.bookmarkTweet);
App.delete("/bookmark/:tweetId", Tweet.unmarkTweet);
App.get("/bookmark/:userId", Tweet.getUserBookmarks);


App.get("/search/:query",User.searchUser) //search usernames
App.get("/user/:username",passAuth,User.getUser) //fetch user object for profile displaying
App.post('/user',authorize,mediaToURL,User.createUser)
App.patch('/user',authorize,mediaToURL,User.updateUser)

App.post("/follow/:id",authorize,Follows.followUser) //auth 
App.delete("/follow/:id",authorize,Follows.unfollowUser) //auth
App.get("/follow/following/:id",authorize,Follows.getFollowing) //auth
App.get("/follow/followers/:id",authorize,Follows.getFollowers) //auth


App.use(corsHandler);



exports.App = functions.https.onRequest(App);


