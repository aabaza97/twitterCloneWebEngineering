import { db } from "../config/firebase"
import { User } from '../Model/userModel'
import { Response, Request } from 'express'



const userCollection = db.collection('Users')
const followsCollection = db.collection('follows')
const createUser = async (req: any, res: Response) => { //auth
    try {
        req.body.id = req.loggedId
        const userDoc = userCollection.doc(req.loggedId)
        const user = new User({ ...req.body, ...req.files })
        await userDoc.set({ ...user })
        res.status(201).send(user)


    } catch (e) {
        if (e instanceof Error) {
            console.log({ error: e.message, stack: e.stack });
            res.status(500).send({ e: e.message, stack: e.stack })
        }
    }
}

const getUser = async (req: any, res: Response) => {  //no auth //auth for isfollowed Bool
    try {
        const logged = req.loggedId
        const username = req.params.username
        const snapshot = await userCollection.where('username', '==', `${username}`).get()
        if (snapshot.empty) {
            return res.status(404).send('Not Found')
        }
        const user = snapshot.docs[0].data()
        const userId = user.id
        if (logged) {
            const isfollowed = (await followsCollection.doc(`${userId},${logged}`).get()).exists
            const followingMe = await (await followsCollection.doc(`${logged},${userId}`).get()).exists
            return res.status(200).send({ ...user, isfollowed, followingMe })
        }
        return res.status(200).send({ ...user, isfollowed: undefined, followingMe: undefined })
    } catch (error) {
        if (error instanceof Error) {
            console.log({ error: error.message, stack: error.stack });
            return res.status(500).send({ e: error.message, stack: error.stack })
        }
    }
}

const searchUser = async (req: Request, res: Response) => { //no auth
    try {
        const query = req.params.query
        const snapshot = await userCollection.orderBy('username').startAt(query).endAt(query + '~').select('username', 'name', 'avatar').limit(7).get()


        //
        if (snapshot.empty) {
            return res.status(404).send([])
        }


        const result: any[] = []
        snapshot.docs.forEach((doc) => {
            const user = doc.data()
            result.push(user)
        })
        result.sort((a, b) => a.username.indexOf(`${query}`) - b.username.indexOf(`${query}`))
        return res.status(200).send(result)

    } catch (error) {
        if (error instanceof Error) {
            console.log({ error: error.message, stack: error.stack });
            return res.status(500).send({ e: error.message, stack: error.stack })
        }
    }
}

const updateUser = async (req: any, res: Response) => {
    try {
        const updates: any = {
            name: req.body.name,
            birthdate: req.body.birthdate,
            avatar: req.files.avatar,
            coverPhoto: req.files.coverPhoto,
            bio: req.body.bio,
            location: req.body.location
        }

        //deletes undefined or unmentioned properties
        Object.keys(updates).forEach(element => {
            if (!updates[element])
                delete updates[element]
        })


        if (Object.keys(updates).length === 0) {
            return res.status(400).send({})
        }

        const userDoc = userCollection.doc(req.loggedId)
        await userDoc.update(updates)
        return res.status(201).send((await userDoc.get()).data())

    } catch (error) {
        if (error instanceof Error) {
            console.log({ error: error.message, stack: error.stack });
            return res.status(500).send({ e: error.message, stack: error.stack })
        }
    }

}



export { createUser, getUser, searchUser, updateUser }
