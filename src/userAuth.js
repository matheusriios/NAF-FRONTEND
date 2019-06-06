import baseurl from './service';

/*
    Aqui faremos a requisição para ter acesso as informaçoes do usuario logado
*/

const userAuth = async() => {
    if (window.localStorage.getItem('token') !== undefined) {
        const respUserAuth = await fetch(`${baseurl.usuarioAutenticado}`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`
            }
        });

        if (respUserAuth.status !== 200) {
            return alert('Ocorreu um problema, entre em contato com o adminstrador')
        }

        return await respUserAuth.json();
    }
}

export default userAuth
