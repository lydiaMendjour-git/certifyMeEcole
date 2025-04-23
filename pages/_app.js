import '../styles/App.css';
import '../styles/Header.css';
import { AuthProvider } from './PageAcceuil/AuthContext'; // Assurez-vous que le chemin est correct

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// Important si vous surchargez getInitialProps dans _app.js
MyApp.getInitialProps = async (appContext) => {
  // Appel possible des getInitialProps des pages
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps };
};

export default MyApp;