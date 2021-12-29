import {db} from "../config/firebase"
import {User} from '../Model/userModel'
import { Response } from 'express'
const path = require('path')
import os = require('os')
import fs = require('fs')
const Busboy = require('busboy')
const uploadMedia = require('../StorageUtils/uploadMedia')
//const mediaToURL = require('../middleware/mediaToURL')
const colectionName = 'Users'



const createUser = async (req: any ,res: Response) => {
    try{
        
        const busboy =  Busboy({headers: req.headers})
        const tmpdir = os.tmpdir()

    
        
        // This object will accumulate all the fields, keyed by their name
        const fields : { [key: string]: any } = {}
        //fields.blnk = 'blnk'
        
        // This object will accumulate all the uploaded files, keyed by their name.
        const uploads : { [key: string]: any } = {}

        // This code will process each non-file field in the form.
        busboy.on('field', (fieldname : string , val :any ) => {
        
            console.log(`Processed field ${fieldname}: ${val}.`)
            fields[fieldname] = val
            
        })

        const fileWrites: Promise<unknown>[] = []

        // This code will process each file uploaded.
        busboy.on('file', (fieldname : string, file :any, filename : any) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
            console.log(`Processed file ${filename}`)
            const filepath = path.join(tmpdir, filename.filename)
            uploads[fieldname] = filepath

            const writeStream = fs.createWriteStream(filepath)
            file.pipe(writeStream)


            const promise = new Promise((resolve, reject) => {
                file.on('end', () => {
                writeStream.end()
                })
                writeStream.on('finish', resolve)
                writeStream.on('error', reject)
            })
            fileWrites.push(promise)
            })

            // Triggered once all uploaded files are processed by Busboy.
            // We still need to wait for the disk writes (saves) to complete.
            busboy.on('finish', async () => {
            await Promise.all(fileWrites)
            //Text fields saved normally in req.body
                req.body = fields
                //Upload files to Cloud Storage
                const storedDataURLs = await uploadMedia(uploads)
                
                req.files = storedDataURLs
                console.log({...req.body,...req.files})
                const user = new User({...req.body,...req.files})
                const userDoc = db.collection(colectionName).doc()

                userDoc.set({...user})
                res.status(201).send(user)

                for (const file in uploads) {

                    fs.unlinkSync(uploads[file])
                }
        })
        
        busboy.end(req.rawBody)
        
    
    }catch(e){
        console.log(e)
        if(e instanceof Error)
        res.status(500).send({e:e.message,stack:e.stack})
    }
}

export {createUser}