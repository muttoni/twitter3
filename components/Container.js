import * as fcl from "@onflow/fcl"
import { useEffect, useState } from "react"

import GetTweetsByAccount from '../cadence/scripts/GetTweetsByAccount.cdc'
import CreateNewTweet from '../cadence/transactions/CreateNewTweet.cdc'
import styles from '../styles/Container.module.css'
import useConfig from "../hooks/useConfig"
import useCurrentUser from '../hooks/useCurrentUser'

import { BLOCK_EXPLORER_URLS } from "../constants"

import Tweet from './Tweet'

export default function Container() {
  const [tweetList, setTweetList] = useState([])
  const [tweetText, setTweetText] = useState('')
  const [lastTransactionId, setLastTransactionId] = useState()
  const [transactionStatus, setTransactionStatus] = useState('N/A')
  const { network } = useConfig()
  const user = useCurrentUser()

  const isEmulator = network => network !== 'mainnet' && network !== 'testnet'
  const isSealed = statusCode => statusCode === 4 // 4: 'SEALED'

  useEffect(() => {
    if (lastTransactionId) {
      console.log('Last Transaction ID: ', lastTransactionId)

      fcl.tx(lastTransactionId).subscribe(res => {
        setTransactionStatus(res.statusString)
  
        // Query for new chain string again if status is sealed
        if (isSealed(res.status)) {
          getTweets()
        }
      })
    }

    const fetchTweets = async () => {
      await getTweets(user?.addr);
    };

    if (user?.addr) {
      fetchTweets();
    }
    
  }, [lastTransactionId, user])

  const getTweets = async (account) => {
    account = user?.addr;

    let res;

    try {
      res = await fcl.query({
        cadence: GetTweetsByAccount,
        args: (arg, t) => [arg(account, t.Address)]
      })
    } catch(e) {
      res = []
    }

    console.log(res)

    setTweetList(res.sort((a, b) => b.id - a.id))
  }

  const createTweet = async (event) => {
    event.preventDefault()

    if (!tweetText.length) {
      throw new Error('Please add a new greeting string.')
    }

    const transactionId = await fcl.mutate({
      cadence: CreateNewTweet,
      args: (arg, t) => [arg(tweetText, t.String)]
    })

    setLastTransactionId(transactionId)
  }
  
  const openExplorerLink = (transactionId, network) => window.open(`${BLOCK_EXPLORER_URLS[network]}/transaction/${transactionId}`, '_blank')


  return (
    <div className={styles.container}>
      <div>
        <form onSubmit={createTweet}>
        <label htmlFor="tweet">Create a new Tweet</label>
        <textarea 
          id="tweetContents"               
          placeholder="I feel..."
          value={tweetText}
          onChange={e => setTweetText(e.target.value)}
          name="tweetContents" required></textarea>
          <small>Share your thoughts with the world.</small>
          <input type="submit" value="Tweet" />
        </form>
      </div>
      <hr />
      <h3>Your Tweets</h3>
        {
        tweetList.length > 0 ?
          tweetList.map((tweet) => {
            return <Tweet address={user?.addr} message={tweet.message} key={tweet.id} />
          }) : 'Your tweets will show up here!'
        } 

    </div>
  )
}
