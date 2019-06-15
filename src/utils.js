import baseUrl from './service'
import recuperar from './login'

export default {    
    openDropDownMenuAccount: () => {
        const containerBtnDropAccount = document.querySelector('.container-btn-drop-account')
        if(containerBtnDropAccount !== null){
            containerBtnDropAccount.addEventListener('click', (e) => {
                e.preventDefault()   
                document.querySelector('.drop-down-acount').classList.toggle('active')
            })
        }        
    },

    exibeNomeUserMenu: async () => {        
        if(document.querySelector('.page-logado') !== null) {
            const userLogado = document.querySelectorAll('.user-logado')   

            const emailUserLogado = document.querySelector('.email.user-logado')
            const respAuth = await fetch(`${baseUrl.usuarioAutenticado}`, {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            });
            
            const userAuth = await respAuth.json()
            const { atendente } = userAuth

            if(respAuth.status === 200) {
                if(atendente !== null){
                    const { name, email} = userAuth
                    userLogado.forEach(user => {
                        user.innerHTML = name
                    })
                    emailUserLogado.innerHTML = email
                }
            }
        }
    },

    modal: () => {
        const divModal = document.createElement('div')                       
        divModal.innerHTML = `
            <div class="modal fade" id="modalReservaAtendente" tabindex="-1" role="dialog" aria-labelledby="modalReservaAtendente" aria-hidden="true">
                <div class="modal-dialog container-modal" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="modalReservaAtendente">Reserva do Atendente</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <td>Cliente</td>
                                        <td>Serviço</td>
                                        <td>Data</td>
                                        <td>Status</td>
                                        <td>Obs</td>
                                    </tr>      
                                </thead>      
                                <tbody id="body-reserva-atendente">
                                       
                                </tbody>
                            </table>   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary close-modal" data-dismiss="modal">Fechar</button>                        
                        </div>
                    </div>
                </div>
            </div>
        `
        document.body.appendChild(divModal)
    },

    loadEvent: () => {
        const divLoad = document.createElement('div')

        divLoad.innerHTML = `
            <div class="container-loader">
                <div class="loader">

                </div>
            </div>
        `        
        document.body.appendChild(divLoad)
    },   
    
    maskPhone: () => {
        const maskPhone = document.querySelectorAll('.mask-phone')
        
        maskPhone.forEach(phone => {
            phone.addEventListener('change', (e) => {
                e.preventDefault()                          
            })
            
        })
        
    },

    validarUsuario: (data) => {
        var cliente = data.cliente;
        if(cliente)
            cliente = data.cliente.user.name;
        else
            cliente= "Cliente Removido"

        return cliente

    },

    menuMobile: () => {
        const app       = document.getElementById('app')
        const openModalAndClose = document.querySelectorAll('.open-menu-mobile')
        const conteudoApp = document.querySelector('.conteudo-app')
        const menuLateral = document.querySelector('.menu-lateral')
        openModalAndClose.forEach(m => {
            m.addEventListener('click', e => {
                menuLateral.classList.toggle('activeMenuMobile')
                app.classList.toggle('activeMenuMobile')
                conteudoApp.classList.toggle('activeMenuMobile')
            })
        })
        
    }, 

    tratamentoStatusAtendimento: ( data ) => {
        switch (data.status) {
            case "A":
                return "Em Atendimento"
                break;
            case "E":
                return "Lista de espera"
                break;
            case "C":
                return "Cancelado"
                break;
            case "F":
                return "Finalizado"
                break;
            default:
                break;
        }
    },
    
    tratamentoPerfilGerente: ( perfil ) => {
        switch (perfil) {
            case "G":
                return "Gerente"
                break;
            case "U":
                return "Atendente"
                break;            
            default:
                break;
        }
    },

    /*
        No metodo abaixo se passa por parametro um objeto contendo :
        msgError : para a mensagem  que serar mostrado
        title : o titulo da modal 
        btn : caso queira inserir algum  botao para envento
    */

    modalMensagemError: ( msg ) => {
        if(!msg.btn) {
            msg.btn = " ";
        }
        if(!msg.title) {
            msg.title = " ";
        }
        if(!msg.msgError) {
            msg.msgError = " ";
        }
        const modalMsgError = document.createElement('div');
        modalMsgError.innerHTML = `
            <div class="modal fade" id="modalMsgError" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">${msg.title}</h5>
                            <button type="button" class="close btn-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ${msg.msgError}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-close" data-dismiss="modal">Close</button>
                            ${msg.btn}
                        </div>
                    </div>
                </div>
            </div>        
        `
        document.body.appendChild(modalMsgError);

        $('#modalMsgError').modal('show');
        if(msg.id && msg.btn) {
            const abrirModal = document.querySelector(`#${msg.id}`)
            if(abrirModal) {
                abrirModal.addEventListener('click',(e)=>{
                    e.preventDefault();
                    recuperConta();
                    $('#modalMsgError').modal('hide');
                    destroyModal();
                })
            }
        }

        const btnclose = document.querySelectorAll('.btn-close');
        if(btnclose){
            btnclose.forEach((btn)=>{
                btn.addEventListener('click',(e)=>{
                    e.preventDefault();
                    destroyModal();
                })
            })
        }
    },    

}

const destroyModal = ( ) =>{
    var node = document.getElementById("modalMsgError");
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

const recuperConta = () => {
    const login = document.querySelector('#containerLogin');
    login.style.display = "none";
    const paiLogin = document.querySelector('#paiContainerLogin')
    
    paiLogin.innerHTML =
    `   
        <div class="container-form shadow-sm bg-white rounded">
            <h3 class="text-center">Recuperar Senha</h3>
            <p class="text-center">Para prosseguir digite suas credenciais</p>
            <form action="" class="d-flex form-login flex-column w-100 justify-content-center align-items-center">
                <div class="w-100 d-flex flex-column justify-content-center align-items-center content-input">
                    <input type="text" id="cpfRecuperar" class="mb-2 w-75 p-1 form-control" placeholder="Cpf">
                    <input type="text" id="emailRecuperar" class="mb-2 w-75 p-1 form-control" placeholder="Email">
                </div>
                <a href="" class="w-100 d-flex justify-content-center container-btn-login">
                    <button type="button" class="btn btn-dark mt-3 p-2 w-75 btn-recuperar">Recuperar</button>
                </a>
            </form>
        </div>    
    `

    const btnRecuperar = document.querySelector('.btn-recuperar');
    if(btnRecuperar) {
        btnRecuperar.addEventListener('click', (e)=>{
            e.preventDefault();
            recuperar.recuperarConta();
        })
    }
}