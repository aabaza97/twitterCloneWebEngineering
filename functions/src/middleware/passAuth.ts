import { NextFunction,Response } from 'express'
import {auth} from '../config/firebase'


const passAuth = async (req : any, res : Response ,next :NextFunction) => {
    try {

        const idToken = req.header('Authorization')
        const decodedIdToken = await auth.verifyIdToken(idToken)
        if(decodedIdToken){
            req.loggedId = decodedIdToken.uid
        }
        else{
            req.loggedId = undefined
        }
        
        next()
    } catch (error) {
        req.loggedId = undefined
        next()
    }
}
module.exports = passAuth
