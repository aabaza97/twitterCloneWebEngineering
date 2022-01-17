import { NextFunction,Response } from 'express'
import {auth} from '../config/firebase'

const authorize = async (req : any, res : Response ,next :NextFunction) => {
    try {

        const idToken = req.header('Auhtorization')
        const decodedIdToken = await auth.verifyIdToken(idToken)
        if(!decodedIdToken){
            return res.status(401).send('Error authenticating')
        }
        req.loggedId = decodedIdToken.uid
        next()
    } catch (error) {
        res.status(401).send({e:'Please authorize'})
    }
}
module.exports = authorize