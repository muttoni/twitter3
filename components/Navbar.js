import * as fcl from '@onflow/fcl'
import useCurrentUser from '../hooks/useCurrentUser'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const user = useCurrentUser()
  
  return (
    <nav>
      <ul>
        <li>
          <h1 className={styles.title}>Twitter<a href="https://developers.flow.com/">3</a></h1>
          <p className={styles.subtitle}>Thoughts onchain'ed</p>
        </li>
    </ul>

    <ul>
    <li>
      {!user.loggedIn && 
        <button 
        onClick={fcl.authenticate}>
        Log In With Wallet
        </button>
      }
      {user.loggedIn && 
        (
          <>
          <div className={styles.address}>{ user?.addr }</div>
          <button 
          onClick={fcl.unauthenticate} 
          className={styles.button}>
          Log Out
          </button>
          </>
          )
        }
        </li>
      </ul>
      
      </nav>
      )
    }