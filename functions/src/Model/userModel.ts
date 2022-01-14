

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
        this.avatar = body.avatar || '/'
        this.coverPhoto = body.coverPhoto || '/'
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

