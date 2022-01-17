import { v4 as uuidv4 } from "uuid";
import {storageBucket} from '../config/firebase'

interface valByString {
    [key: string]: any
  }

module.exports = async (mediaPaths:valByString) => {
  try{
    const files : valByString = {}
    const metadata = {
        contentType: 'image/jpeg',
      };
    for(const file in mediaPaths){
        const filename = uuidv4()
        await storageBucket.upload(mediaPaths[file],{
            destination: filename,
            gzip:true,
            metadata
        })
        const url = `http://storage.googleapis.com/${storageBucket.name}/${filename}`
        files[file] = url
    }
    return files
  }catch(e){
    console.log(e)
  }
}
