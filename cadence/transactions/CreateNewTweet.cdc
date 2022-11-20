// Create new Tweet

import Twitter from 0xTwitter

// This transaction creates a new tweet with an argument
transaction (message: String) {
    // Let's check that the account has a collection
    prepare(acct: AuthAccount) {
        if acct.borrow<&Twitter.Collection>(from: Twitter.TweetCollectionStoragePath) != nil {
            log("Collection exists!")
        } else {
            // let's create the collection if it doesn't exist
            acct.save<@Twitter.Collection>(<-Twitter.createEmptyCollection(), to: Twitter.TweetCollectionStoragePath)
            // publish a reference to the Collection in storage
            acct.link<&{Twitter.CollectionPublic}>(Twitter.TweetCollectionPublicPath, target: Twitter.TweetCollectionStoragePath)
        }

        // borrow the collection
        let collection = acct.borrow<&Twitter.Collection>(from: Twitter.TweetCollectionStoragePath)

        // call the collection's saveTweet method and pass in a Tweet resource
        collection?.saveTweet(tweet: <-Twitter.createTweet(message))
        log("Tweet created successfully, with message ".concat(message))
    }
}