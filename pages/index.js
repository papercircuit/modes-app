import Head from 'next/head'
import MainView from './MainView'
import styles from '../styles/Home.module.css'

const Home = () => (
  <>
    <Head>
      <title>MODES</title>
      <meta name="description" content="Learn about musical modes" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <MainView />
    <style jsx>{styles}</style>
  </>
)

export default Home