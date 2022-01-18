import { db } from "../config/firebase"
import { Response } from 'express'
import { firestore } from "firebase-admin"


const userCollection = db.collection('Users')
const followsCollection = db.collection('follows')

const followUser = async (req: any, res: Response) => { // add auth middleware
    try {
        const batch = db.batch()
        const followedId = req.params.id
        const followerId = req.loggedId
        if (followedId === followerId) {
            return res.status(400).send("self-following not allowed")
        }
        const followDoc = followsCollection.doc(`${followedId},${followerId}`)
        const doc = {
            followerId,
            followedId
        }
        batch.set(followDoc, doc)

        const followedUser = userCollection.doc(`${followedId}`)
        const follower = userCollection.doc(`${followerId}`)
        batch.update(followedUser, { followers: firestore.FieldValue.increment(1) })
        batch.update(follower, { following: firestore.FieldValue.increment(1) })

        batch.commit()
        res.status(201).send("Success")
    } catch (error) {
        if (error instanceof Error)
            res.status(500).send({ e: error.message, stack: error.stack })
    }
}

const unfollowUser = async (req: any, res: Response) => { //add auth

    try {
        const batch = db.batch()
        const followedId = req.params.id
        const followerId = req.loggedId
        if (followedId === followerId) {
            return res.status(400).send("Bad Request")
        }
        const followDoc = followsCollection.doc(`${followedId},${followerId}`)
        batch.delete(followDoc)

        const unfollowedUser = userCollection.doc(`${followedId}`)
        const unfollower = userCollection.doc(`${followerId}`)
        batch.update(unfollowedUser, { followers: firestore.FieldValue.increment(-1) })
        batch.update(unfollower, { following: firestore.FieldValue.increment(-1) })

        await batch.commit()
        res.status(200).send("Success user unfollowed")

    } catch (error) {
        if (error instanceof Error) {
            console.log({ error: error.message, stack: error.stack });
            res.status(500).send({ e: error.message, stack: error.stack })
        }
    }
}

//get followers
//get following
const getFollows = async (req: any, res: Response, type: string) => { //auth
    try {
        const userId = req.params.id
        const followerSnapshot = await followsCollection.where(type, '==', `${userId}`).get()
        const follows = followerSnapshot.docs
        const followsUsers = []
        for (var i = 0; i < follows.length; i++) {
            const data = follows[i].data()
            var id
            if (type === 'followerId')
                id = data['followedId']
            else
                id = data['followerId']

            const user = (await userCollection.doc(id).get()).data()
            if (!user) {
                continue
            }

            followsUsers.push({
                name: user.name,
                username: user.username,
                avatar: user.avatar
            })
        }
        res.status(200).send(followsUsers)
    } catch (error) {
        if (error instanceof Error) {
            console.log({ error: error.message, stack: error.stack });
            res.status(500).send({ e: error.message, stack: error.stack })
        }
    }
}


const getFollowing = async (req: any, res: Response) => { //auth

    getFollows(req, res, 'followerId')
}
const getFollowers = async (req: any, res: Response) => {
    getFollows(req, res, 'followedId')
}

export { followUser, unfollowUser, getFollowing, getFollowers }