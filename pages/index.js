import Head from 'next/head'
import Navbar from '../components/Navbar'
import '../flow/config.js'

import Container from '../components/Container'
import useCurrentUser from '../hooks/useCurrentUser'

export default function Home() {
  const { loggedIn } = useCurrentUser()

  return (
    <div>


      <Head>
        <title>Twitter 3</title>
        <meta name="description" content="Twitter3 - thoughts onchain'ed" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <Navbar />
        {loggedIn && <Container />}
      </main>
    </div>
  )
}
