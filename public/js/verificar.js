/*
    Aqui verificaremos se há alguem logado se sim 
    verificaremos o perfil dele 
    se for gerente ira ter permisão para acessar a pagina de gerente
    se for atendente ira ter permisão para acessar a pagina de atendete
    se for cliente ira ter permisão para acessar a pagina de cliente
    se não, redirecionamos o usuario para pagina de cadastro

    Obs: esse script deve ser carregado antes da pagina
*/
(function() {
    const perfil = window.localStorage.getItem('perfil');
    const cliente = window.localStorage.getItem('cliente');
    const isLogged = window.localStorage.getItem('isLogged');
    if (isLogged == "true") {
        if (perfil != "null") {
            if (perfil == 'G') { //Verificar se o perfil de quem esta logado é de gerente
                if (location.pathname !== '/pages/tela-gerente.html') { // se o perfil for de gerente e estiver em outra pagina diferente redireciona de volta para gerente
                    return window.location.href = 'http://localhost:8080/pages/tela-gerente.html'
                }
            }
            if (perfil == 'U') {
                if (location.pathname !== '/pages/tela-atendente.html') {
                    return window.location.href = 'http://localhost:8080/pages/tela-atendente.html'
                }
            }
        }
        if (cliente != "null") {
            if (location.pathname !== '/pages/tela-cliente.html') {
                return window.location.href = 'http://localhost:8080/pages/tela-cliente.html'
            }
        }
    } else {
        return window.location.href = 'http://localhost:8080/'
    }
}());