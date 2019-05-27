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
        
}