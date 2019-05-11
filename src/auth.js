import { createBrowserHistory } from './history'
import baseUrl from './service';


const auth = async () => {    
    const history = createBrowserHistory();
    const location = history.location;
    if(window.localStorage.getItem('token') !== undefined) {
        if(location.pathname !== '/') {            
            const respAuth = await fetch(`${baseUrl.usuarioAutenticado}`, {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            });
            
            if(respAuth.status !== 200) {
                window.location.href = 'http://localhost:8080/'
                return 
            }            
        }    
    }        
}

export default auth

