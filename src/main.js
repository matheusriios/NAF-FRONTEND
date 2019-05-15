import atendente from './atendente'
import login from './login'

function main() {     
    login.login()
    login.logout()
    atendente().listaAtendentes()
    atendente().createAtendente()
    atendente().listaReservas()
    atendente().createCliente()
    atendente().createHorario()
    atendente().createServico()
    atendente().createReserva()
}

main()