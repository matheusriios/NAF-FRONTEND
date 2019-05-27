import baseUrl from './service';
import atendente from './atendente';
import horario from './horarios';
import servicos from './servicos';
import cliente from './cliente';
const reservas = () => {
    
    const loadTodasReservas = async () => {
        const token = window.localStorage.getItem('token')
        const response = await fetch(`${baseUrl.listaReservas}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const body = await response.json()                 
        return body
    }

    const listaReservas = async () => {        
        if(document.querySelector('.page-logado-gerente') !== null){
            const bodyReservas = document.getElementById('body-reserva');
            const todasReservas = await loadTodasReservas()     
            
            if(bodyReservas !== null) {                
                todasReservas.map((reserva, index) => {                    
                    bodyReservas.innerHTML += `
                        <tr>
                            <td>${reserva.servico.nome}</td>
                            <td>${reserva.atendente !== null ? reserva.atendente.user.name 
                                                           : 'Atendente removido' }</td>
                            <td>${reserva.cliente !== null ? reserva.cliente.user.name 
                                                           : 'Cliente removido' }</td>                            
                            <td>${reserva.status}</td>                        
                        </tr>  
                    `            
                })    
            }        
        }
    }

    const createReserva = async () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {
            const loadAtendentes = await atendente().loadTodosAtendentes()
            const loadHorarios   = await horario().loadTodosHorarios()
            const loadServicos   = await servicos().loadTodosServicos()
            const loadClientes   = await cliente().loadTodosClientes()
            
            const selectAtendente = document.getElementById('selectAtendente')
            const selectDataHorario = document.getElementById('selectDataHorario')
            const selectServico = document.getElementById('selectServico')
            const selectCliente = document.getElementById('selectCliente')
            const selectStatus = document.getElementById('selectStatus')

            if(loadAtendentes.length > 0){
                loadAtendentes.map(atendente => {
                    selectAtendente.innerHTML += `<option value='${atendente.id}'>${atendente.user.name}</option>   `
                })
            }

            if(loadHorarios.length > 0){
                loadHorarios.map(horario => {
                    selectDataHorario.innerHTML += `<option value='${horario.id}'>${horario.data}</option>   `
                })
            }

            if(loadServicos.length > 0){
                loadServicos.map(servico => {
                    selectServico.innerHTML += `<option value='${servico.id}'>${servico.nome}</option>   `
                })
            }

            if(loadClientes.length > 0){
                loadClientes.map(cliente => {
                    selectCliente.innerHTML += `<option value='${cliente.id}'>${cliente.user.name}</option>   `
                })
            }

            const btnCadastrarReserva = document.querySelector('.btn-cadastrar-reserva')
            btnCadastrarReserva.addEventListener('click', async (e) => {
                const selectedAtendente = selectAtendente.options[selectAtendente.selectedIndex].value                           
                const selectedDataHorario = selectDataHorario.options[selectDataHorario.selectedIndex].value
                const selectedServico = selectServico.options[selectServico.selectedIndex].value                 
                const selectedCliente = selectCliente.options[selectCliente.selectedIndex].value
                const selectedStatus = selectStatus.options[selectStatus.selectedIndex].value                            
                
                const formData = new FormData()
                formData.append('id_atendente', `${selectedAtendente}`)
                formData.append('id_horario', `${selectedDataHorario}`)
                formData.append('id_servico', `${selectedServico}`)
                formData.append('id_cliente', `${selectedCliente}`)
                formData.append('status', `${selectedStatus}`)
                
                const respCreateReserva = await fetch(`${baseUrl.createReserva}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                    },
                    body: formData
                })

                if(respCreateReserva.status !== 200)
                    return alert('Não foi possível efetuar a reserva')

                alert('Serviço cadastrado com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)                
            })
        }
    }
    
    const deleteReserva = async () => {        
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarReserva   = document.querySelector('.btn-deletar-reserva')    
            const selectReservaDelete = document.getElementById('selectReservaDelete')                                                
            const todasReservas = await loadTodasReservas()
            
            todasReservas.forEach(reserva => {            
                selectReservaDelete.innerHTML += `<option value=${reserva.id}>${reserva.servico.nome}</option>`
            })
            btnDeletarReserva.addEventListener('click', async (e) => {
                e.preventDefault()
                const selectedReserva = selectReservaDelete.options[selectReservaDelete.selectedIndex].value    
                
                const respDeleteReserva = await fetch(`${baseUrl.deleteReserva}/${selectedReserva}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                })
    
                if(respDeleteReserva.status !== 200)    
                    return alert('Não foi possível deletar a tarefa')
                
                alert('Reserva deletada com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)
            })
        }
    }

    return {
        loadTodasReservas,
        listaReservas,
        createReserva,
        deleteReserva
    }
}

export default reservas;