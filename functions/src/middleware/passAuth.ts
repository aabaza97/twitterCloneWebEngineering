import { NextFunction,Response } from 'express'


const passAuth = async (req: any ,res: Response,next:NextFunction) => {
    req.loggedId = req.body.id
    next()
}

module.exports = passAuth
