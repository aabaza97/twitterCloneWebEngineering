import {Response} from "express";
import {db} from "../config/firebase";

type Request = {
  body: Tweet
}

const colName = "tweets";

const composeTweet = async (req:Request, res: Response) => {
  const {text} = req.body;
  try {
    // reference to the new document to be added in the collection specified.
    const tweetDoc = db.collection(colName).doc();
    // tweet an object of the data to be set in the newly added document.
    const tweet = {
      id: tweetDoc.id,
      text: text,
    };
    // setting the tweet.
    tweetDoc.set(tweet);
    // responding with success status code along side data.
    return res.status(200).send({
      status: "success",
      data: tweet,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};


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

export {composeTweet, getAllTweets};
