import baseUrl from './service';

const reserva = () => {
    
    
    const loadTodosAtendentes = async () => {
        const token = window.localStorage.getItem('token')
        const response = await fetch(`${baseUrl.listarAtendentes}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const body = await response.json()  
        
        return body
    }

    const listaAtendentes = async () => {
        if(document.getElementById('body-lista-atendentes') !== null) {
            const bodyListaAtendentes = document.getElementById('body-lista-atendentes')
            let todosAtendentes = await loadTodosAtendentes()
            
            todosAtendentes.map(antendente => {
                bodyListaAtendentes.innerHTML += `
                    <tr>
                        <td>${antendente.user.name}</td>
                        <td>${antendente.user.email}</td>
                        <td>${antendente.celular}</td>
                        <td>${antendente.perfil}</td>
                        <td><button type="button" class="btn btn-secondary">Reservas</button></td>                    
                    </tr>  
                `
            })    
        }        
    }


    return {        
        listaAtendentes
    }    
}

export default reserva

