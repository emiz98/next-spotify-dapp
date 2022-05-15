import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <Footer />
    </Provider>
  )
}

export default MyApp
