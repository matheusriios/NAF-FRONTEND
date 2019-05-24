import { createBrowserHistory } from './history'
import baseUrl from './service';

const auth = async (content) => {        
    const history = createBrowserHistory();
    const location = history.location;
                    
    if(window.localStorage.getItem('token') !== undefined) {
        if(location.pathname !== '/') { 
            content.classList.add('disable')
            const respAuth = await fetch(`${baseUrl.usuarioAutenticado}`, {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            });
                        
            if(respAuth.status !== 200) {
                return window.location.href = 'http://localhost:8080/'
            }                         
            content.classList.remove('disable')
        }    
    }        
}

export default auth

