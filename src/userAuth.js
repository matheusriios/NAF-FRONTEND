import baseUrl from './service';

const userAuth = async (content) => {                                
    if(window.localStorage.getItem('token') !== undefined) {
        const respUserAuth = await fetch(`${baseUrl.usuarioAutenticado}`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`
            }
        });
                    
        if(respUserAuth.status !== 200) {
            return alert('Ocorreu um problema, entre em contato com o adminstrador')
        }            
                    
        return await respUserAuth.json(); 
    }        
}

export default userAuth

