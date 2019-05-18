import baseUrl from './service';
import auth from './auth'
import utils from './utils'

const login = () => {        
    auth(document.body)
    
    if(document.querySelector('.page-login') !== null) {        
        const btnLogin = document.querySelector('.btn-login');    
        btnLogin.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const formData = new FormData()
            formData.append('grant_type', 'password')
            formData.append('client_id', '1')
            formData.append('client_secret', 'KREUhtWzcoPp8W4lXKl1esjuyqn3JettR5TLY5UX')
            formData.append('username', `${email}`)
            formData.append('password', `${senha}`)
            formData.append('scope', '')
            
            //Gera token de autenticação
            const respAuth = await fetch(`${baseUrl.authUsuario}`, {
                method: 'POST',
                body: formData,                
            });        
            
            if(respAuth.status !== 200) 
                return alert("Verifique suas credenciais")            
            
            const bodyAuth = await respAuth.json()
            //Salva o token na memoria do navegador
            window.localStorage.setItem('token', `${bodyAuth.access_token}`)

            //Retorna usuario logado
            const respAuthUser = await fetch(`${baseUrl.usuarioAutenticado}`, {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            });
            console.log(await respAuthUser.json())
            // const userAuth = await respAuthUser.json()
            // utils.loadEvent()
            
            // if(userAuth.atendente || userAuth.cliente !== null) {
            //     if(userAuth.atendente.perfil === 'G'){    
            //         setTimeout(() => {
            //             return window.location.href = 'http://localhost:8080'
            //         }, 3000)
            //     }
            // }
            // if(userAuth.atendente !== null) {
            //     if(userAuth.atendente.perfil === 'G'){    
            //         setTimeout(() => {
            //             return window.location.href = 'http://localhost:8080/pages/tela-gerente.html'
            //         }, 3000)
            //     }
            // }
        });    
    }            
}

const logout = () => {        
    
    if(document.querySelector('.page-login') !== null) 
        return
    
    const btnLogout = document.querySelector('.btn-logout');
    
    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();            
        const respLogout = await fetch(`${baseUrl.logout}`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`
            }
        })

        window.location.reload(); // atualiza a página                    
    })
}

export default {
    login,
    logout
}

