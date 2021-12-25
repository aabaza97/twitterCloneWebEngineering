import {db} from "../config/firebase"
import {User} from '../Model/userModel'
import { Request,Response } from 'express'
import * as bcrypt from 'bcryptjs'


const colectionName = 'Users'


const createUser = async (req: Request ,res: Response) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password,8)
        const user = new User(req.body)
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