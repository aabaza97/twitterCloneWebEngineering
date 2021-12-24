
import {User} from '../Model/userModel'
import { Request,Response } from 'express'


const createUser = async (req: Request ,res: Response) => {
    try{
         
        const user = new User(req.body)
        
        res.status(201).send(user)
    }catch(e){
        res.status(500).send('eee')
    }
}

export {createUser}