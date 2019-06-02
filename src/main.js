import atendente from './atendente';
import cliente from './cliente';
import reservas from './reservas';
import servicos from './servicos';
import horario from './horarios';
import login from './login'
import utils from './utils'

function main() {         
    utils.openDropDownMenuAccount()
    utils.exibeNomeUserMenu()    
    utils.menuMobile()
    login.login()
    login.logout()

    atendente().listaAtendentes()
    atendente().createAtendente()
    atendente().alterarAtendente()
    atendente().deleteAtendente()

    servicos().createServico()
    servicos().alterarServico()

    reservas().createReserva()
    reservas().createReservaCliente()    
    reservas().listaReservas()
    reservas().loadReservasCliente()
    reservas().loadReservasAtendente()
    reservas().alterarReserva()
    reservas().deleteReserva()

    cliente().createCliente()
    cliente().deleteCliente()
    cliente().alterarClientes()

    horario().createHorario()
    horario().deleteHorario()
    horario().alterarHorario()
}

main()