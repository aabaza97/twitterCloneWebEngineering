import {Response} from "express";
import {db} from "../config/firebase";

type Request = {
  body: Tweet
  params: {id: string}
}

const colName = "tweets";
// const likesColName = "user_tweet_likes";


const composeTweet = async (req:Request, res: Response) => {
  const {
    text,
    userId,
    postPrivacy,
    hasMedia,
    hasMention,
    repostCount,
    repliesCount,
    likesCount,
    location,
    timestamp,
    mediaType} = req.body;
  try {
    // reference to the new document to be added in the collection specified.
    const tweetDoc = db.collection(colName).doc();
    // tweet an object of the data to be set in the newly added document.
    const newTweet = {
      id: tweetDoc.id,
      text: text,
      userId: userId,
      postPrivacy: postPrivacy,
      hasMedia: hasMedia,
      hasMention: hasMention,
      isRepost: false,
      repostCount: repostCount,
      repliesCount: repliesCount,
      likesCount: likesCount,
      repostToPostId: "",
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: false,
      replyToPostId: ""};

    // setting the tweet.
    tweetDoc.set(newTweet);
    // responding with success status code along side data.
    return res.status(200).send({
      status: "success",
      data: newTweet,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Gets all tweets from tweets collection.
const getAllTweets =async (req:Request, res: Response) => {
  try {
    const tweetsList: Tweet[] = [];
    const snapshot = await db.collection(colName).get();
    snapshot.forEach((doc: any) => tweetsList.push(doc.data()));
    return res.status(200).json(tweetsList);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Gets a tweet's content given its id.
const getTweet = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const snapshot = await db.collection(colName).doc(id).get();
    return res.status(200).json(snapshot.data());
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Deletes a tweet of a user given the tweet's id.
const deleteTweet =async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const tweetDoc = db.collection(colName).doc(id);
    await tweetDoc.delete();
    return res.status(200).json({
      status: "success",
      message: "Tweet deleted successfully."
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// Gets a list of tweets composed by the user.
const getUserTweets = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    // run a query over the tweets collection
    // to get all tweets composed by him given the id.
    const userTweetsList: Tweet[] = [];
    const querySnapshot = await db.collection(colName)
        .where("userId", "==", id)
        .get();
    querySnapshot.forEach((doc: any) => userTweetsList.push(doc.data()));
    return res.status(200).json(userTweetsList);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const replyToTweet = async (req:Request, res: Response) => {
  const {id} = req.params;
  const {
    text,
    userId,
    postPrivacy,
    hasMedia,
    hasMention,
    repostCount,
    repliesCount,
    likesCount,
    location,
    timestamp,
    mediaType} = req.body;
  try {
    const replyDoc = db.collection(colName).doc();
    const newReply = {
      id: replyDoc.id,
      text: text,
      userId: userId,
      postPrivacy: postPrivacy,
      hasMedia: hasMedia,
      hasMention: hasMention,
      isRepost: false,
      repostCount: repostCount,
      repliesCount: repliesCount,
      likesCount: likesCount,
      repostToPostId: "",
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: true,
      replyToPostId: id};
    await replyDoc.set(newReply);
    return res.status(200).send({
      status: "success",
      data: newReply,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


const repostTweet = async (req:Request, res: Response) => {
  const {id} = req.params;
  const {
    text,
    userId,
    postPrivacy,
    hasMedia,
    hasMention,
    repostCount,
    repliesCount,
    likesCount,
    location,
    timestamp,
    mediaType} = req.body;
  try {
    const repostDoc = db.collection(colName).doc();
    const newRepost = {
      id: repostDoc.id,
      text: text,
      userId: userId,
      postPrivacy: postPrivacy,
      hasMedia: hasMedia,
      hasMention: hasMention,
      isRepost: true,
      repostCount: repostCount,
      repliesCount: repliesCount,
      likesCount: likesCount,
      repostToPostId: id,
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: false,
      replyToPostId: ""};
    await repostDoc.set(newRepost);
    return res.status(200).send({
      status: "success",
      data: repostDoc,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getTweetReplies = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const userTweetsList: Tweet[] = [];
    const querySnapshot = await db.collection(colName)
        .where("replyToPostId", "==", id)
        .get();
    querySnapshot.forEach((doc: any) => userTweetsList.push(doc.data()));
    return res.status(200).json(userTweetsList);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


// const likeTweet = async (req:Request, res: Response) => {
//   const {id} = req.params;
//   try {
//     // -- Transaction
//     // 1- create a like reference document in the likes collection...
//     // 2- increase the count inside the doc
//   } catch (error) {
//     return res.status(500).json(error.message);
//   }
// };

export {
  composeTweet,
  getAllTweets,
  deleteTweet,
  getTweet,
  getUserTweets,
  getTweetReplies,
  replyToTweet,
  repostTweet,
};
