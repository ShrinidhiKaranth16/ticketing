import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps,currentUser})=>{
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps} currentUser={currentUser}/>
        </div>
    )
}

AppComponent.getInitialProps = async (appCpntext) => {
    const client = buildClient(appCpntext.ctx);
    const response = await client.get('/api/users/currentuser');
    let pageProps = {}
    if(appCpntext.Component.getInitialProps){
        pageProps = await appCpntext.Component.getInitialProps(appCpntext.ctx);
    }
    return { currentUser: response.data.currentUser, pageProps };
}

export default AppComponent