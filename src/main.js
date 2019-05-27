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
    login.login()
    login.logout()
    atendente().listaAtendentes()
    atendente().createAtendente()
    atendente().alterarAtendente()
    atendente().deleteAtendente()
    servicos().createServico()
    servicos().alterarServico()
    reservas().listaReservas()
    reservas().createReserva()
    reservas().deleteReserva()
    cliente().createCliente()
    cliente().deleteCliente()
    horario().createHorario()
    horario().deleteHorario()
}

main()