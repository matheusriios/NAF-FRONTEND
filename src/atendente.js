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
            
            todosAtendentes.map((atendente, index) => {
                bodyListaAtendentes.innerHTML += `
                    <tr>
                        <td>${atendente.user.name}</td>
                        <td>${atendente.user.email}</td>
                        <td>${atendente.celular}</td>
                        <td>${atendente.perfil}</td>
                        <td><button type="button" data-target="#modalReservaAtendente" data-toggle="modal" class="btn btn-secondary btn-modal-reserva">Reservas</button></td>                    
                    </tr>  
                `
                document.querySelectorAll('.btn-modal-reserva')[index].setAttribute('id', `${atendente.id} modalReservaAtendente`)
                document.querySelectorAll('.btn-modal-reserva')[index].setAttribute('idAtendente', `${atendente.id}`)
            })    
        }        

        openModalReservasAtendente()
    }

    const openModalReservasAtendente = () => {
        const divModal = document.createElement('div'),
              token    = window.localStorage.getItem('token') 
        let idUser = ''        
        
        document.querySelectorAll('.btn-modal-reserva').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault()
                idUser = btn.getAttribute('idAtendente')                

                const respUser = await fetch(`${baseUrl.getAtendente}/${idUser}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const { reserva } = await respUser.json()

                console.log(reserva)
            })
        })                


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
                        <div class="modal-body">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <td>Cliente</td>
                                        <td>Serviço</td>
                                        <td>Horario</td>
                                        <td>Status</td>
                                        <td>Obs</td>
                                    </tr>      
                                </thead>      
                                <tbody id="body-reserva-atendente">
                                    <tr>
                                        <td>Serviço</td>
                                        <td>Atendente</td>
                                        <td>Cliente</td>
                                        <td>Status</td>
                                        <td>Status</td>
                                    </tr>      
                                </tbody>
                            </table>   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>                        
                        </div>
                    </div>
                </div>
            </div>
        `
        document.body.appendChild(divModal)
    }

    return {        
        listaAtendentes
    }    
}

export default reserva

