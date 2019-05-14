import atendente from './atendente'
import login from './login'

function main() {     
    login()
    atendente().listaAtendentes()
    atendente().createAtendente()
    atendente().listaReservas()
}

main()