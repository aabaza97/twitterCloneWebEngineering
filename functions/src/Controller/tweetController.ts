
import {Response, Request} from "express";
import {admin, db} from "../config/firebase";


const tweetsCollection = db.collection("tweets");
const likesCollection =  db.collection("user_tweet_likes");
const bookmarksCollection =  db.collection("user_tweet_bookmarks");

//POST request /tweets
const composeTweet = async (req:Request, res: Response) => {
  const {text, userId, hasMention, location, timestamp, mediaType} = req.body;
  const files = req.files
  try {
    // reference to the new document to be added in the collection specified.
    const tweetDoc = tweetsCollection.doc();
    // tweet an object of the data to be set in the newly added document.
    const newTweet = {
      id: tweetDoc.id,
      text: text,
      userId: userId,
      postPrivacy: "",
      hasMedia: files ? true : false,
      mediaContent: files || [],
      hasMention: hasMention,
      isRepost: false,
      repostCount: 0,
      repliesCount: 0,
      likesCount: 0,
      repostToPostId: "" ,
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: false,
      replyToPostId: ""};

    // setting the tweet.
    await tweetDoc.set({newTweet});
    // responding with success status code along side data.
    return res.status(200).send({
      status: "success",
      data: newTweet,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json({error: error.message,stack: error.stack});
    }
  }
};

//GET request /tweets
// Gets all tweets from tweets collection.
const getAllTweets =async (req:Request, res: Response) => {
  try {
    const tweetsList: Tweet[] = [];
    const snapshot = await tweetsCollection.get();
    snapshot.forEach((doc: any) => tweetsList.push(doc.data()));
    return res.status(200).json(tweetsList);
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//GET request /tweet/:id
// Gets a tweet's content given its id.
const getTweet = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const tweetSnapshot = await tweetsCollection.doc(id).get();
    const tweetReplies = await getTweetRepliesforTweetWithId(id);

    const response = {
      tweetData: tweetSnapshot.data(),
      tweetReplies: tweetReplies
    }
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//DELETE request /tweeets/:tweetId
// Deletes a tweet of a user given the tweet's id.
const deleteTweet =async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    const tweetDoc = tweetsCollection.doc(id);
    await tweetDoc.delete();
    return res.status(200).json({
      status: "success",
      message: "Tweet deleted successfully."
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//GET request /profile/:userId
// Gets a list of tweets composed by the user.
const getUserTweets = async (req:Request, res: Response) => {
  const {id} = req.params;
  try {
    // run a query over the tweets collection
    // to get all tweets composed by him given the id.
    const userTweetsList: Tweet[] = [];
    const querySnapshot = await tweetsCollection
        .where("userId", "==", id)
        .get();
    querySnapshot.forEach((doc: any) => userTweetsList.push(doc.data()));
    return res.status(200).json(userTweetsList);
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//POST request /reply/:tweetId
//Creates a new reply to a tweet given its ID with data.
const replyToTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;
  const {
    text, userId, hasMention, timestamp, mediaType, repliesCount
  } = req.body;
  const files = req.files
  try {
    //creating a batch...
    const batch = db.batch();

    //adding reply document...
    const replyDoc = tweetsCollection.doc();
    const newReply = {
      id: replyDoc.id,
      text: text,
      userId: userId,
      postPrivacy: "",
      hasMedia: files ? true : false,
      mediaContent: files || [],
      hasMention: hasMention,
      isRepost: false,
      repostCount: 0,
      repliesCount: 0,
      likesCount: 0,
      repostToPostId: "",
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: true,
      replyToPostId: tweetId};

    batch.set(replyDoc, newReply);


    //updating replies count in tweet's doc...
    const tweetDoc = tweetsCollection.doc(tweetId);
    batch.update(tweetDoc, "repliesCount", admin.firestore.FieldValue.increment(1));


    //commiting the batch...
    await batch.commit();

    //returning resuponse.
    return res.status(200).send({
      status: "success",
      data: newReply,
      repliesCount: (repliesCount + 1)
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//POST request /retweet/:tweetId
const retweetTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;
  const { text, userId, hasMention, location, timestamp, mediaType} = req.body;
  const files = req.files
  try {
    //creating a batch...
    const batch = db.batch();

    //creating new repost...
    const retweetDoc = tweetsCollection.doc();
    const newRetweet = {
      id: retweetDoc.id,
      text: text,
      userId: userId,
      postPrivacy: "",
      hasMedia: files ? true : false,
      mediaContent: files || [],
      hasMention: hasMention,
      isRepost: true,
      repostCount: 0,
      repliesCount: 0,
      likesCount: 0,
      repostToPostId: tweetId,
      location: location,
      timestamp: timestamp,
      mediaType: mediaType,
      isReply: false,
      replyToPostId: ""
    };
    batch.set(retweetDoc, newRetweet);

    //updating original tweet...
    const tweetDoc =tweetsCollection.doc(tweetId);
    batch.update(tweetDoc, "repostCount", admin.firestore.FieldValue.increment(1));

    //committing batch...
    await batch.commit();

    //returning response.
    return res.status(200).send({
      status: "success",
      data: retweetDoc,
      tweetId: tweetId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};


//GET request /replies/tweetId
const getTweetReplies = async (req:Request, res: Response) => {
  const {tweetId} = req.params;
  try {
    const userTweetsList: Tweet[] = [];
    const querySnapshot = await tweetsCollection
        .where("replyToPostId", "==", tweetId)
        .get();
    querySnapshot.forEach((doc: any) => userTweetsList.push(doc.data()));
    return res.status(200).json(userTweetsList);
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};


const getTweetRepliesforTweetWithId = async (tweetId: string) => {
  try {
    const userTweetsList: Tweet[] = [];
    const querySnapshot = await tweetsCollection
        .where("replyToPostId", "==", tweetId)
        .get();
    querySnapshot.forEach((doc: any) => userTweetsList.push(doc.data()));
    return userTweetsList;
  } catch (error) {
    return [];
  }
};

//POST request with body containing {tweetId, userId} to /bookmark
const likeTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;  
  const {userId} = req.body; 
  try {
    // creating a write batch...
    var batch = db.batch();

    const likeCustomId = tweetId + "_" + userId;
    const newLike = {
      tweetId: tweetId,
      userId: userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    //creating a like reference document in the likes collection... 
    const likeDocRef = likesCollection.doc(likeCustomId);
    batch.set(likeDocRef, newLike);

    //increasing the count inside the tweet's doc...
    const tweetDoc = tweetsCollection.doc(tweetId);
    batch.update(tweetDoc, "likesCount", admin.firestore.FieldValue.increment(1));

    //commiting the batch...
    await batch.commit();

    //sending response.
    return res.status(200).json({
      status: "Like Success",
      data: newLike,
      tweetId: tweetId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//DELETE request with body containing {tweetId, userId} to /bookmark
const dislikeTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;  //tweet id
  const {userId} = req.body; // user id
  try {
    // creating a write batch...
    var batch = db.batch();

    const likeCustomId = tweetId + "_" + userId;
   
    //creating a like reference document in the likes collection... 
    const likeDocRef = likesCollection.doc(likeCustomId);
    batch.delete(likeDocRef);

    //increasing the count inside the tweet's doc...
    const tweetDoc = tweetsCollection.doc(tweetId);
    batch.update(tweetDoc, "likesCount", admin.firestore.FieldValue.increment(-1));

    //commiting the batch...
    await batch.commit();

    //sending response.
    return res.status(200).json({
      status: "Dislike success",
      tweetId: tweetId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//POST request with body containing {tweetId, userId, timestamp} to /bookmark
const bookmarkTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;
  const {userId, timestamp} = req.body;
  try {
    const bookmarkCustomId = tweetId + "_" + userId;
    const bookmarkDoc = bookmarksCollection.doc(bookmarkCustomId);
    const newBookmark = {
      tweetId: tweetId,
      userId: userId,
      timestamp: timestamp
    }

    await bookmarkDoc.set(newBookmark);

    return res.status(200).json({
      status: "Bookmark Success",
      data: newBookmark,
      tweetId: tweetId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//DELETE request with body containing {tweetId, userId} to /bookmark
const unmarkTweet = async (req:Request, res: Response) => {
  const {tweetId} = req.params;
  const {userId} = req.body;
  try {
    const bookmarkCustomId = tweetId + "_" + userId;
    await bookmarksCollection.doc(bookmarkCustomId).delete();
    return res.status(200).json({
      description: "Delete Bookmark Success",
      tweetId: tweetId,
      forUser: userId
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};

//GET request with params containing {userId} to /bookmark
const getUserBookmarks = async (req:Request, res: Response) => {
  const {userId} = req.params

  try {
    const userBookmarkedTweetsList = [];

    const querySnapshot = await bookmarksCollection.where("userId", "==", userId).get();
    
    
    for (const doc of querySnapshot.docs) {
      const tweetId = doc.id.split("_")[0];
      const tweet = await tweetsCollection.doc(tweetId).get();
      userBookmarkedTweetsList.push(tweet.data());
    }
    
    return res.status(200).json(userBookmarkedTweetsList);
  } catch (error) {
    if (error instanceof Error) {
      console.log({error: error.message,stack: error.stack});
      return res.status(500).json(error.message);
    }
  }
};



export {
  composeTweet,
  getAllTweets,
  deleteTweet,
  getTweet,
  getUserTweets,
  getTweetReplies,
  replyToTweet,
  retweetTweet,
  likeTweet,
  dislikeTweet,
  bookmarkTweet,
  unmarkTweet,
  getUserBookmarks
};
