

export class User {

    email: string
    name: string
    username: string
    avatar : string
    coverPhoto : string
    bio : string
    location : string
    birthdate : string



     constructor(body : User){


        this.email = body.email
        this.name = body.name
        this.username = body.username
        this.avatar = body.avatar || '/'
        this.coverPhoto = body.coverPhoto || '/'
        this.bio = body.bio
        this.location = body.location
        this.birthdate = ''


    }
    

    static storeImage = (avatar : Object) => {
        return '/'
    }
}

