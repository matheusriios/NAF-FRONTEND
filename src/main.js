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
    reservas().listaReservas()
    cliente().createCliente()
    horario().createHorario()
    servicos().createServico()
    reservas().createReserva()
    atendente().deleteAtendente()
    reservas().deleteReserva()
    cliente().deleteCliente()
    horario().deleteHorario()
    atendente().alterarAtendente()
}

main()