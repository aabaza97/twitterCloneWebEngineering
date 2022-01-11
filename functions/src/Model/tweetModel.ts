
type Tweet = {
    id: string
    text: string
    userId: string
    postPrivacy: string
    hasMedia: boolean
    mediaType: MediaType
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
     video,
     Picture,
     Audio
}
