import {db} from "../config/firebase"
import {User} from '../Model/userModel'
import { Response } from 'express'
const colectionName = 'Users'



const createUser = async (req: any ,res: Response) => {
    try{
        
        const user = new User({...req.body,...req.files})
        const userDoc = db.collection(colectionName).doc()

        userDoc.set({...user})
        res.status(201).send(user)
  
    
    }catch(e){
        console.log(e)
        if(e instanceof Error)
        res.status(500).send({e:e.message,stack:e.stack})
    }
}

export {createUser}