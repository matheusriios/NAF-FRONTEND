import atendente from './atendente'
import login from './login'
import utils from './utils'

function main() {         
    utils.openDropDownMenuAccount()
    utils.exibeNomeUserMenu()   
    utils.maskPhone() 
    login.login()
    login.logout()
    atendente().listaAtendentes()
    atendente().createAtendente()
    atendente().listaReservas()
    atendente().createCliente()
    atendente().createHorario()
    atendente().createServico()
    atendente().createReserva()
    atendente().deleteAtendente()
    atendente().deleteReserva()
    atendente().deleteCliente()
    atendente().deleteHorario()
    atendente().alterarAtendente()
}

main()