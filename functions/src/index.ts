import * as functions from "firebase-functions";
import * as express from "express";
import {composeTweet, getAllTweets} from "./Controller/tweetController";
import * as User from './Controller/userController'
import * as Follows from './Controller/followsController'
import * as cors from "cors";
//import authorize from './middleware/auth'
const mediaToURL = require('./middleware/mediaToURL')
const passAuth = require('./middleware/passAuth')
const App = express();
const corsHandler = cors({origin: true});
App.use(express.json())


App.get("/", (req, res) => res.status(200).send("Hello there...."));
App.post("/tweets" ,composeTweet);
App.get("/tweets", getAllTweets);



App.get("/search/:query",User.searchUser) //search usernames
App.get("/user/:username",User.getUser) //fetch user object for profile displaying
App.post('/user',mediaToURL,passAuth,User.createUser)
App.patch('/user',passAuth,mediaToURL,User.updateUser)

App.post("/follow/:id",passAuth,Follows.followUser) //auth 
App.delete("/follow/:id",passAuth,Follows.unfollowUser) //auth
App.get("/follow/following/:id",Follows.getFollowing) //auth
App.get("/follow/followers/:id",Follows.getFollowers) //auth


App.use(corsHandler);



exports.App = functions.https.onRequest(App);


