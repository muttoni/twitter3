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
  }, [lastTransactionId])

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
        <label for="tweet">Create a new Tweet</label>
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
      <h3>Your Tweets
      <button onClick={getTweets} className={styles.refresh}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
      </svg>
      </button>
      </h3>
        {
        tweetList.length > 0 ?
          tweetList.map((tweet) => {
            return <Tweet address={user?.addr} message={tweet.message} key={tweet.id} />
          }) : 'Your tweets will show up here!'
        } 

    </div>
  )
}