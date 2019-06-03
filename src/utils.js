import baseUrl from './service'
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
    }


    
}