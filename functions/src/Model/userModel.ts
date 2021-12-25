

export class User {

    email: string
    password: string
    username: string
    avatar : string
    coverPhoto : string
    bio : string
    location : string
    birthdate : string



     constructor(body : User){


        this.email = body.email
        this.password = body.password
        this.username = body.username
        this.avatar = '/'
        this.coverPhoto = '/'
        this.bio = body.bio
        this.location = body.location
        this.birthdate = ''


    }
    

    static storeImage = (avatar : Object) => {
        return '/'
    }
}

