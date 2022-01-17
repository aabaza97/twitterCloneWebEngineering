
type Tweet = {
    id: string
    text: string
    userId: string
    postPrivacy: string
    hasMedia: boolean
    mediaType: MediaType
    mediaContent: string[]
    hasMention: boolean
    isRepost: boolean
    repostToPostId: string
    isReply: boolean
    replyToPostId: string
    likesCount: number
    repliesCount: number
    repostCount: number
    location: string
    timestamp: number

}


enum MediaType {
     Video,
     Picture,
     Audio,
     None
}

enum TweetType {
    Original,
    Retweet,
    Reply
}

enum TweetOperation{
    Compose,
    Read
}

// class Tweet {
//     id: string
//     text: string
//     userId: string
//     postPrivacy: string
//     hasMedia: boolean
//     mediaType: MediaType
//     media: string[]
//     hasMention: boolean
//     isRepost: boolean
//     repostToPostId: string
//     isReply: boolean
//     replyToPostId: string
//     likesCount: number
//     repliesCount: number
//     repostCount: number
//     location: string
//     timestamp: number

//     public constructor(data: Tweet, withTweetType: TweetType, forOperation: TweetOperation) {
//         this.id = data.id
//         this.text = data.text
//         this.userId = data.userId
//         this.postPrivacy = ""

//         this.hasMention = data.hasMention
//         this.location = data.location
//         this.timestamp = data.timestamp

//         switch (withTweetType) {
//             case TweetType.Original:
//                 this.isRepost = false
//                 this.repostToPostId = ""
//                 this.isReply = false
//                 this.replyToPostId = ""
//             break;

//             case TweetType.Reply: 
//             this.isRepost = false
//             this.repostToPostId = ""
//             this.isReply = true
//             this.replyToPostId = this.repostToPostId
//             break;

//             case TweetType.Retweet: 
//                 this.isRepost = true
//                 this.repostToPostId = data.repostToPostId
//                 this.isReply = false
//                 this.replyToPostId = ""
//             break;
//         }

//         switch (forOperation) {
//             case TweetOperation.Read:
//                 this.likesCount = data.likesCount
//                 this.repliesCount = data.repliesCount
//                 this.repostCount = data.repostCount
//                 break;
        
//             default:
//                 this.likesCount = 0
//                 this.repliesCount = 0
//                 this.repostCount = 0
//                 break;
//         }
        
//         switch (key) {
//             case value:
                
//                 break;
        
//             default:
//                 break;
//         }
        
//     }

// }