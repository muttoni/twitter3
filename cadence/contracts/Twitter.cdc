// Twitter-v2.cdc
// Still basic, but with multiple tweets!

pub contract Twitter {

    // Declare a Path constant so we don't need to harcode in tx
    pub let TweetCollectionStoragePath: StoragePath
    pub let TweetCollectionPublicPath: PublicPath

    // Declare the Tweet resource type - nothing changed here!
    pub resource Tweet {
        // The unique ID that differentiates each Tweet
        pub let id: UInt64

        // String mapping to hold metadata
        pub var metadata: {String: String}

        // Initialize both fields in the init function
        init(message: String) {
            self.id = self.uuid
            self.metadata = {
                "message": message
            }
        }
    }

    // Function to create a new Tweet
    pub fun createTweet(_ message: String): @Tweet {
        return <-create Tweet(message: message)
    }

    pub resource interface CollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowTweet(id: UInt64): &Tweet? 
    }

    // NEW! 
    // Declare a Collection resource that contains Tweets.
    // it does so via `saveTweet()`, 
    // and stores them in `self.tweets`
    pub resource Collection: CollectionPublic {
        // an object containing the tweets
        pub var tweets: @{UInt64: Tweet}

        // a method to save a tweet in the collection
        pub fun saveTweet(tweet: @Tweet) {
            // add the new tweet to the dictionary with 
            // a force assignment (check glossary!)
            // If there were to be a value at that key, 
            // it would fail/revert. 
            self.tweets[tweet.id] <-! tweet
        }

        // get all the id's of the tweets in the collection
        pub fun getIDs(): [UInt64] {
            return self.tweets.keys
        }

        pub fun borrowTweet(id: UInt64): &Tweet? {
            if self.tweets[id] != nil {
                let ref = (&self.tweets[id] as &Twitter.Tweet?)!
                return ref
            }
            return nil
        }

        init() {
            self.tweets <- {}
        }

        destroy() {
            // when the Colletion resource is destroyed, 
            // we need to explicitly destroy the tweets too.
            destroy self.tweets
        }
    }

    // create a new collection
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    init() {
        // assign the storage path to /storage/TweetCollection
        self.TweetCollectionStoragePath = /storage/TweetCollection
        self.TweetCollectionPublicPath = /public/TweetCollection
        // save the empty collection to the storage path
        self.account.save(<-self.createEmptyCollection(), to: self.TweetCollectionStoragePath)
        // publish a reference to the Collection in storage
        self.account.link<&{CollectionPublic}>(self.TweetCollectionPublicPath, target: self.TweetCollectionStoragePath)
    }
}