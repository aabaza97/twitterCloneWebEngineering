import {NextFunction, Response} from 'express'
const path = require('path')
import os = require('os')
import fs = require('fs')
const Busboy = require('busboy')
const uploadMedia = require('../StorageUtils/uploadMedia')

module.exports = async (req: any, res :Response, next: NextFunction) => {

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
    
      fields[fieldname] = val
        
    })

    const fileWrites: Promise<unknown>[] = []

    // This code will process each file uploaded.
    busboy.on('file', (fieldname : string, file :any, filename : any) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
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
      next()

      for (const file in uploads) {

          fs.unlinkSync(uploads[file])
      }
    })
    
    busboy.end(req.rawBody)


  }catch(e){

    if(e instanceof Error){
      console.log(e.message, e.stack)
    }
  }
  
}
