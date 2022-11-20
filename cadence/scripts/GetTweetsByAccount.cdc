import Twitter from 0xTwitter

pub struct TweetMetadata {
    pub let id: UInt64
    pub let message: String 

    init(id: UInt64, message: String) {
        self.id = id
        self.message = message
    }
}

// Get tweets owned by an account
pub fun main(account: Address): [TweetMetadata] {
    // Get the public account object for account
    let tweetOwner = getAccount(account)

    // Find the public capability for their Collection
    let capability = tweetOwner.getCapability<&{Twitter.CollectionPublic}>(Twitter.TweetCollectionPublicPath)

    // borrow a reference from the capability
    let publicRef = capability.borrow()
            ?? panic("Could not borrow public reference")

    // get list of tweet IDs
    let tweetIDs = publicRef.getIDs()

    let tweets: [TweetMetadata] = []

    for tweetID in tweetIDs {
        let tweet = publicRef.borrowTweet(id: tweetID) ?? panic("this tweet does not exist")
        let metadata = TweetMetadata(id: tweet.id, message: tweet.metadata["message"]!)
        tweets.append(metadata)
    }

    return tweets
}