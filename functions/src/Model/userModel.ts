

export class User {

    id : string
    email: string
    name: string
    username: string
    avatar : string
    coverPhoto : string
    bio : string
    location : string
    birthdate : string
    followers : number
    following : number
    tweetsNo : number
    creationDate : string



    constructor(body : User){

        this.id = body.id
        this.email = body.email
        this.name = body.username
        this.birthdate = body.birthdate
        this.username = body.username
        this.avatar = 'https://firebasestorage.googleapis.com/v0/b/twitterclonewebengineering.appspot.com/o/default-avatar.png?alt=media&token=7cb1d4bd-3672-4e2f-ae18-9d2fadb7c0a8'
        this.coverPhoto = 'https://firebasestorage.googleapis.com/v0/b/twitterclonewebengineering.appspot.com/o/defCover.jpeg?alt=media&token=c1f0ccdb-dd31-41b0-9b12-c09a7f5c2a25'
        this.bio = body.bio || '/'
        this.location = body.location || '/'
        
        this.followers = 0
        this.following = 0
        this.tweetsNo = 0

        const date = new Date()
        const month = date.toLocaleString('default', { month: 'long' });
        this.creationDate = `${month} ${date.getFullYear()}`


    }
    

}

