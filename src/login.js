import storage from './storage';
import baseurl from './service';
import userAuth from './userAuth';
import auth from './auth'
import utils from './utils'

const login = () => {

    const btnLogin = document.querySelector('.btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', async(e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const formData = new FormData()
            formData.append('grant_type', 'password')

            //Cliente and secret heroku
            formData.append('client_id', '22')
            formData.append('client_secret', 'JHOdqoBLbhQjkASoUjdAMElhQskj2DKMfdEy4NwF')

            formData.append('username', `${email}`)
            formData.append('password', `${senha}`)
            formData.append('scope', '')

            //Loga o usuario e Gera token de autenticação
            const respAuth = await fetch(`${baseurl.authUsuario}`, {
                method: 'POST',
                body: formData,
            });

            if (respAuth.status !== 200)
                alert("Verifique suas credenciais")

            if (respAuth.status == 200) {

                //Salva o token na memoria do navegador
                const bodyAuth = await respAuth.json()
                storage().set({
                    token: bodyAuth.access_token
                })

                getLoginDados();
            }

        });
    }

    const getLoginDados = async() => {
        const userAuthenticated = await userAuth()
        var perfilUser = userAuthenticated.atendente == null ? null : userAuthenticated.atendente.perfil;

        storage().set({
            nome: userAuthenticated.name,
            perfil: perfilUser,
            email: userAuthenticated.email,
            cliente: userAuthenticated.cliente,
            isLogged: true
        })

        loginRedirect(userAuthenticated);
    }

    /*
        Chamada do Metodo responsavel deslogar o usuario
    */
    const btnlogout = document.querySelector('.btn-logout');
    if (btnlogout) {
        btnlogout.addEventListener('click', async(e) => {
            e.preventDefault();
            logout();
        })
    }
}

/*
    Metodo responsavel por redirecionar após o login o usuario para sua devida pagina
*/

const loginRedirect = (dados) => {
    if (dados.atendente) {
        if (dados.atendente.perfil === 'G')
            window.location.href = 'http://localhost:8080/pages/tela-gerente.html'
        else if (dados.atendente.perfil === 'U')
            window.location.href = 'http://localhost:8080/pages/tela-atendente.html'
    } else if (dados.cliente)
        window.location.href = 'http://localhost:8080/pages/tela-cliente.html'
}

/*
    Metodo responsavel deslogar o usuario
*/

const logout = async() => {
    if (storage().get('isLogged')) {
        const respLogout = await fetch(`${baseurl.logout}`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`
            }
        })

        storage().remove('nome');
        storage().remove('perfil');
        storage().remove('email');
        storage().remove('cliente');
        storage().set({
            isLogged: false
        });

        window.location.href = 'http://localhost:8080/'

    }
}

export default {
    login,
}
