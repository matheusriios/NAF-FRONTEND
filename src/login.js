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
            formData.append('client_id', '2')
            formData.append('client_secret', 'AnQ26yJHqbn9pGHECiDbVHwN17C1jrHewt52oosP')

            formData.append('username', `${email}`)
            formData.append('password', `${senha}`)
            formData.append('scope', '')

            //Loga o usuario e Gera token de autenticação
            const respAuth = await fetch(`${baseurl.authUsuario}`, {
                method: 'POST',
                body: formData,
            });

            
            if (respAuth.status !== 200)
            utils.modalMensagemError({
                title: "Dados Incorretos",
                msgError : `Verifique suas credenciais`,
            })
        
            
            if (respAuth.status === 200) {                
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
        if(userAuthenticated.atendente || userAuthenticated.cliente) {
            var perfilUser = userAuthenticated.atendente == null ? null : userAuthenticated.atendente.perfil;

            storage().set({
                nome: userAuthenticated.name,
                perfil: perfilUser,
                email: userAuthenticated.email,
                cliente: userAuthenticated.cliente,
                isLogged: true
            })
    
            loginRedirect(userAuthenticated);
        }else {
            if(userAuthenticated.id && userAuthenticated.name) {
                utils.modalMensagemError({
                    msgError : `Sr. ${userAuthenticated.name} sua conta foi excluida`,
                    id : 'btnRecuperarConta',
                    btn : `<button id="btnRecuperarConta" type="button" class="btn btn-primary">Recuperar conta</button>`,
                    title : `Conta excluida`
                })
            }
        }
       
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

    /*
        Chamada do Metodo responsavel alterar a senha do usuario
    */

    const btnAlterarSenha = document.querySelectorAll('.alterarSenha');
    if(btnAlterarSenha) {
        btnAlterarSenha.forEach((alterarSenha)=>{
            alterarSenha.addEventListener('click',(e)=>{
                e.preventDefault();
                
                utils.modalMensagemError({
                    title: "Alterar senha",
                    msgError : 
                    ` 
                        <form>
                            <div class="form-row">
                                <div class="form-group col-md-12">
                                    <label for="exampleInputEmail1">Infome sua nova senha</label>
                                    <input type="password" class="form-control" id="alterarSenha" aria-describedby="emailHelp" placeholder="Senha">
                                </div>
                                <div class="form-group col-md-12">                                    
                                    <input type="password" class="form-control" id="alterarSenhaConfirmacao" aria-describedby="emailHelp" placeholder="Confirme a senha">
                                </div>
                            </div>
                        </form>
                    `,
                    btn : `<button id="btnSenhaAlterar" type="button" class="btn btn-primary">Alterar senha</button>`,
                })
                const btn = document.querySelector('#btnSenhaAlterar');
                if(btn){
                    btn.addEventListener('click',(e)=>{
                        e.preventDefault();
                        const senha = document.querySelector('#alterarSenha').value;
                        const senhaAux = document.querySelector('#alterarSenhaConfirmacao').value;
                       
                        if(senha && senhaAux) {
                            if(senha===senhaAux) {
                                alterarSenhaCliente({
                                    senhaCliente: senha,
                                    senhaClienteConfirmacao: senhaAux,
                                    token: storage().get('token')
                                });
                            } else {
                                $('#modalMsgError').modal('hide');
                                utils.removerModal("modalMsgError")
                                
                                utils.modalMensagemError({
                                    title: "Erro ao tentar alterar a senha",
                                    msgError : `As senhas são diferentes tente novamente`,
                                })
                        
                            }
                        } else {
                            $('#modalMsgError').modal('hide');
                            utils.removerModal("modalMsgError")
                            
                            utils.modalMensagemError({
                                title: "Erro ao tentar alterar a senha",
                                msgError : `Informe as senhas antes de prosseguir`,
                            })
                        }

                    })
                }
               
            })
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

const recuperarConta = async () => {
    const cpf = document.getElementById('cpfRecuperar').value;
    const email = document.getElementById('emailRecuperar').value;
    const userAuthenticated = await userAuth()
    
    if(userAuthenticated.cpf == cpf && userAuthenticated == email) {
        const formData = new FormData()
        formData.append('email', `${email}`)

        //Recupera a conta do usuario
        const respAuth = await fetch(`${baseurl.recuperar}`, {
            method: 'POST',
            body: formData,
        });
    
        const bodyAuth = await respAuth.json()
        if(respAuth.status == 200) {
            utils.modalMensagemError({
                title: "Parabéns!",
                msgError : `Conta recuperada com sucesso`,
            })
        }
    } else {
        utils.modalMensagemError({
            title: "Dados Incorretos",
            msgError : `Informaçoes incorretas, por favor tente novamente`,
        })
    }

}

const alterarSenhaCliente = async ( dados ) => {
    var formData = new FormData();

    formData.append('password', `${dados.senhaCliente}`)
    formData.append('password_confirmation', `${dados.senhaCliente}`)

    var url = `${baseurl.password}`;
    const respAlterarSenha = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${dados.token}`
        },
        body: formData
    })

    if(respAlterarSenha.status == 200) {
        $('#modalMsgError').modal('hide');
        utils.removerModal("modalMsgError")
        setTimeout(()=>{
            utils.modalMensagemError({
                title: "Alteração de senha",
                msgError : `Senha Alterada com Sucesso`,
            })
        },1000)
    } else {
        $('#modalMsgError').modal('hide');
        utils.removerModal("modalMsgError")
        utils.modalMensagemError({
            title: "Alteração de senha",
            msgError : `Erro ao tentar alterar senha`,
        })
    }
}

export default {
    login,
    recuperarConta
}
