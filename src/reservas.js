import baseUrl from './service'
import atendente from './atendente'
import horario from './horarios'
import servicos from './servicos'
import cliente from './cliente'
import utils from './utils'
import userAuth from './userAuth'

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
            const bodyReservas = document.getElementById('body-reserva')
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
                            <td>${utils.tratamentoStatusAtendimento(reserva)}</td>                        
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

            if(selectReservaDelete === null)
                return 
            
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

    const alterarReserva = async () => { 
        if(document.getElementById('body-listar-reserva') !== null) {
            const bodyListarReservas = document.getElementById('body-listar-reserva')
            let todasReservas = await loadTodasReservas()
            todasReservas.map((reservas, index) => {                
                bodyListarReservas.innerHTML += `
                    <tr>
                        <td>${reservas.atendente.user.name}</td>
                        <td>${reservas.servico.nome}</td>
                        <td>${utils.validarUsuario(reservas)}</td>
                        <td>${reservas.horario.data}</td>
                        <td>${reservas.status}</td>
                        <td>${reservas.obs}</td>
                        <td><button data-target="#modalReservas-${reservas.id}" data-toggle="modal" idReservas="${reservas.id}" class="btn btn-warning alterar-dados">Alterar</button></td>                    
                    </tr>  
                `
            })    
        }        
        openModalDadosReservas()
    }

    const openModalDadosReservas = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {

            let todasReservas = await loadTodasReservas()
    
            todasReservas.map((reserva) => {
                const divModal = document.createElement('div')                       
                divModal.innerHTML = `
                    <div class="modal fade" id="modalReservas-${reserva.id}" tabindex="-1" role="dialog" aria-labelledby="modalReservas" aria-hidden="true">
                        <div class="modal-dialog container-modal" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="modalReservaAtendente">Dados da Reserva</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                    <form action="">
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label">Atendente</label>
                                            <div class="col-sm-10">
                                                <label>${reserva.atendente.user.name}</label>
                                                <select id="selectAlterarAtendente-${reserva.id}" class="custom-select">
                                                    <option selected>Selecione o Atendente</option>                                                        
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label">Data/Horario</label>
                                            <div class="col-sm-10">
                                                <label>${reserva.horario.data}</label>
                                                <select id="selectAlterarDataHorario-${reserva.id}" class="custom-select">
                                                    <option selected>Selecione a data/hora</option>                                                        
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label">Serviço</label>
                                            <div class="col-sm-10">
                                                <label>${reserva.servico.nome}</label>
                                                <select id="selectAlterarServico-${reserva.id}" class="custom-select">
                                                    <option selected>Selecione o serviço</option>                                                        
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label">Cliente</label>
                                            <div class="col-sm-10">
                                                <label>${reserva.cliente.user.name}</label>
                                                <select id="selectAlterarCliente-${reserva.id}" class="custom-select">
                                                    <option selected>Selecione o cliente</option>                                                        
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label for="inputPassword" class="col-sm-2 col-form-label">Status</label>
                                            <div class="col-sm-10">
                                                <label>${utils.tratamentoStatusAtendimento(reserva)}</label>
                                                <select id="selectAlterarStatus-${reserva.id}" class="custom-select">
                                                    <option selected>Selecione o status do atendimento</option>
                                                    <option value="E">Lista de espera</option>
                                                    <option value="A">Em Atendimento</option>
                                                    <option value="C">Cancelado</option>
                                                    <option value="F">Finalizado</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleFormControlTextarea1">Observação</label>
                                            <textarea class="form-control" id="textareaAlterarObservacao-${reserva.id}" rows="3">${reserva.obs}</textarea>
                                        </div>
                                        <div class="form-group w-100 d-flex justify-content-end pr-3">
                                            <button id="btnModalAlterarReserva-${reserva.id}" type="button" class="btn btn-primary w-25 btn-cadastrar-reserva">Enviar</button>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>                        
                                </div>
                            </div>
                        </div>
                    </div>
                `          
                document.body.appendChild(divModal)
            })            
            
            todasReservas.map( async (reserva) => {
                const loadAtendentes = await atendente().loadTodosAtendentes()
                const loadHorarios   = await horario().loadTodosHorarios()
                const loadServicos   = await servicos().loadTodosServicos()
                const loadClientes   = await cliente().loadTodosClientes()  
                
                const selectAtendente = document.getElementById(`selectAlterarAtendente-${reserva.id}`)
                const selectDataHorario = document.getElementById(`selectAlterarDataHorario-${reserva.id}`)
                const selectServico = document.getElementById(`selectAlterarServico-${reserva.id}`)
                const selectCliente = document.getElementById(`selectAlterarCliente-${reserva.id}`)
                const selectStatus = document.getElementById(`selectAlterarStatus-${reserva.id}`)

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

                var btn = document.querySelector(`#btnModalAlterarReserva-${reserva.id}`)
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                   
                    const selectedAtendente = selectAtendente.options[selectAtendente.selectedIndex].value                           
                    const selectedDataHorario = selectDataHorario.options[selectDataHorario.selectedIndex].value
                    const selectedServico = selectServico.options[selectServico.selectedIndex].value                 
                    const selectedCliente = selectCliente.options[selectCliente.selectedIndex].value
                    const selectedStatus = selectStatus.options[selectStatus.selectedIndex].value                            
                    const textAreaObservacao    = document.getElementById(`textareaAlterarObservacao-${reserva.id}`).value
                    const token            = window.localStorage.getItem('token') 

                    console.log(selectedAtendente)
                    console.log(selectedDataHorario)
                    console.log(selectedServico)
                    console.log(selectedCliente)
                    console.log(selectedStatus)
                    console.log(textAreaObservacao)

                    const formData = new FormData()
                    if(selectedAtendente != "Selecione o Atendente")
                        formData.append('id_atendente', `${selectedAtendente}`)

                    if(selectedDataHorario != "Selecione a data/hora")
                        formData.append('id_horario', `${selectedDataHorario}`)

                    if(selectedServico != "Selecione o serviço")
                        formData.append('id_servico', `${selectedServico}`)

                    if(selectedCliente != "Selecione o cliente")
                        formData.append('id_cliente', `${selectedCliente}`)
                    
                    if(selectedStatus != "Selecione o status do atendimento")
                        formData.append('status', `${selectedStatus}`)

                    
                    formData.append('obs', `${textAreaObservacao}`)                    
                   
                    var url = `${baseUrl.alterarReserva}/${reserva.id}/editar`
                    
                    const respCreateAtendete = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respCreateAtendete.status === 200) {
                        alert('reserva alterado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                    return alert('Houve um problema ao tentar alterar a reserva, tente novamente')
                    
                })
            })

        }
    }

    /* Cliente */
    const createReservaCliente = async () => {
        if((document.querySelector('.page-logado-cliente') !== null) ) {            
            const loadHorarios      = await horario().loadTodosHorarios()
            const loadServicos      = await servicos().loadTodosServicos()
            const userAuthenticated = await userAuth()                      
            const selectServico = document.getElementById('selectServico')                        
            const selectDataHorario = document.getElementById('selectDataHorario')
            
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

            const btnCadastrarReserva = document.querySelector('.btn-cadastrar-reserva')
            btnCadastrarReserva.addEventListener('click', async (e) => {
                const selectedDataHorario = selectDataHorario.options[selectDataHorario.selectedIndex].value
                const selectedServico = selectServico.options[selectServico.selectedIndex].value                                                 
                const selectedCliente = userAuthenticated.cliente.id
                
                const formData = new FormData()                
                formData.append('id_horario', `${selectedDataHorario}`)
                formData.append('id_servico', `${selectedServico}`)
                formData.append('id_cliente', `${selectedCliente}`)      
                formData.append('status', `A`)
                
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

                alert('Reserva efetuada com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)                
            })
        }
    }

    const loadReservasCliente = async () => {
        if(document.querySelector('.page-logado-cliente') !== null){
            
            const token = window.localStorage.getItem('token')
            const bodyTableReservaCliente = document.getElementById('body-reserva-cliente')
            const respAuth = await fetch(`${baseUrl.usuarioAutenticado}`, {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
                }
            });
    
            const bodyAuth = await respAuth.json(),
                  idCliente = bodyAuth.cliente.id

                  
    
            const responseCliente = await fetch(`${baseUrl.getCliente}/${idCliente}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(responseCliente.status !== 200)
                return alert('Listagem das reservas temporariamente fora do ar, tente novamente mais tarde')

            const bodyCliente = await responseCliente.json()              
            const { reserva } = bodyCliente
            
            if(reserva !== undefined) {
                reserva.map(r => {
                    bodyTableReservaCliente.innerHTML += `
                        <tr>
                            <td>${r.servico.nome}</td>
                            <td>${r.atendente.user.name}</td>
                            <td>${r.horario.data}</td>
                            <td>${utils.tratamentoStatusAtendimento(r)}</td>
                        </tr>  
                    `
                })
            }
        }
        
    }
    /* Cliente */

    /* Atendente */
    const loadReservasAtendente = async () => {
        if(document.querySelector('.page-logado-atendente') !== null) {
            
            const token = window.localStorage.getItem('token')
            const bodyTableReservaAtendente = document.getElementById('body-reservas-atendente')
            const respAuth = await userAuth()
            
            const idAtendente = respAuth.atendente.id                        
    
            const responseAtendente = await fetch(`${baseUrl.getAtendente}/${idAtendente}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const bodyAtendente = await responseAtendente.json()  
            const {reserva}     = bodyAtendente
                                
            reserva.map(r => {
                bodyTableReservaAtendente.innerHTML += `
                                        <tr>
                                            <td>${r.servico.nome}</td>
                                            <td>${r.cliente.user.name}</td>
                                            <td>${r.horario.data}</td>
                                            <td>${r.status}</td>
                                        </tr>  
                `
            })
        }        
    }
    
    
    return {
        loadTodasReservas,
        listaReservas,
        createReserva,
        deleteReserva,
        alterarReserva,
        loadReservasAtendente,
        createReservaCliente,
        loadReservasCliente,        
    }
}

export default reservas