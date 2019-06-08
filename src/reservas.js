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

    const getReservaFiltrada = async (dataInicio, dataFinal) => {
        const token     = window.localStorage.getItem('token')        
        
        if(dataInicio === undefined || dataFinal === undefined)
            return alert('Error ao filtrar informação')
        const response  = await fetch(`${baseUrl.reservaFiltrado}?where[data]=${dataInicio}&and[data]=${dataFinal}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        const respBody = await response.json()
        
        return respBody
    }

    const filtrarReservas = () => {       
        document.querySelectorAll('.jsCalendar-current').forEach(item => item.classList.remove('jsCalendar-current'))        
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnFiltrar = document.getElementById('btnFiltrar'),
                  btnLimparFiltrar = document.getElementById('btnLimparFiltrar')

            let dataInicio = '',
                dataFinal = ''            
            const calendar1 = jsCalendar.new("#calendar1", "now", {
                "language": "pt"
            })
            
            const calendar2 = jsCalendar.new("#calendar2", "now", {
                "language": "pt"
            })         
            
            calendar1.onDateClick((event, date) => {                
                event.target.classList.add('jsCalendar-selecionado')                
                event.target.parentElement.parentNode.childNodes.forEach(tr => {
                    tr.childNodes.forEach(td => {                        
                        if(td !== event.target)
                            td.classList.remove('jsCalendar-selecionado')
                    })
                })

                const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1 // +1 pois no getMonth Janeiro começa com zero.
                const dia = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
                dataInicio = `${date.getFullYear()}-${mes}-${dia}`                                
            })

            calendar2.onDateClick((event, date) => {                          
                event.target.classList.add('jsCalendar-selecionado')                
                event.target.parentElement.parentNode.childNodes.forEach(tr => {
                    tr.childNodes.forEach(td => {                        
                        if(td !== event.target)
                            td.classList.remove('jsCalendar-selecionado')
                    })
                })
                const mes = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1 // +1 pois no getMonth Janeiro começa com zero.
                const dia = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
                dataFinal = `${date.getFullYear()}-${mes}-${dia}`                                
            })

                
            //Limpar FILTRO      
            btnLimparFiltrar.addEventListener('click', async e => {
                if(document.querySelector('.page-logado-gerente') !== null){
                    const bodyReservas = document.getElementById('body-reserva')
                    const todasReservas = await loadTodasReservas()     
                    bodyReservas.innerHTML = ''               
                    if(bodyReservas !== null) {   
                        todasReservas.map((reserva, index) => {         
                            
                            bodyReservas.innerHTML += `
                                <tr>
                                    <td>${reserva.servico.nome}</td>
                                    <td>${reserva.atendente !== null ? reserva.atendente.user.name 
                                                                   : 'Atendente removido' }</td>
                                    <td>${reserva.cliente !== null ? reserva.cliente.user.name 
                                                                   : 'Cliente removido' }</td>
                                    <td>${utils.converterDataHorario(reserva.horario.data)}</td>
                                    <td>${utils.tratamentoStatusAtendimento(reserva)}</td>                        
                                </tr>  
                            `            
                        })    
                    }        
                }
            })



            btnFiltrar.addEventListener('click', async e => {
                if(dataFinal === '' || dataFinal === '')
                    return alert('Selecione uma data')
                    
                                    
                const reservasFiltradas = await getReservaFiltrada(dataInicio, dataFinal)
                const bodyReservas = document.getElementById('body-reserva')                                   
                if(bodyReservas !== null) { 
                    
                    if(reservasFiltradas.length === 0)
                    return alert('Nenhuma reserva foi encontrada nessa data, tente novamente selecionando outra data')
                    
                    bodyReservas.innerHTML = '' 
                    if(reservasFiltradas.length > 1) {
                        reservasFiltradas.map((reserva) => {                                 
                            bodyReservas.innerHTML += `
                                <tr>
                                    <td>${reserva.servico.nome}</td>
                                    <td>${reserva.atendente !== null ? reserva.atendente.user.name 
                                                                   : 'Atendente removido' }</td>
                                    <td>${reserva.cliente !== null ? reserva.cliente.user.name 
                                                                   : 'Cliente removido' }</td>
                                    <td>${utils.converterDataHorario(reserva.horario.data)}</td>
                                    <td>${utils.tratamentoStatusAtendimento(reserva)}</td>                        
                                </tr>  
                            `            
                        })    
                    }else {                       
                        reservasFiltradas.map((reserva) => {                                 
                            bodyReservas.innerHTML = `
                                <tr>
                                    <td>${reserva.servico.nome}</td>
                                    <td>${reserva.atendente !== null ? reserva.atendente.user.name 
                                                                   : 'Atendente removido' }</td>
                                    <td>${reserva.cliente !== null ? reserva.cliente.user.name 
                                                                   : 'Cliente removido' }</td>
                                    <td>${utils.converterDataHorario(reserva.horario.data)}</td>
                                    <td>${utils.tratamentoStatusAtendimento(reserva)}</td>                        
                                </tr>  
                            `            
                        })    
                    }                    
                }       
            })
        }
    }

    const cardIndicativosAtendimento = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const todosAtendimentos = await loadTodasReservas()
            const todosServicos = await servicos().loadTodosServicos()
            const cardBodyEspera = document.querySelector('.container-card-info-atendimentos .descp-espera')
            const cardBodyEmAtendimento = document.querySelector('.container-card-info-atendimentos .descp-em-atendimento')
            const cardBodyFinalizado = document.querySelector('.container-card-info-atendimentos .descp-finalizado')
            const cardBodyCancelado = document.querySelector('.container-card-info-atendimentos .descp-cancelado')
            const cardBodyTabelServicos = document.getElementById('body-servicos')
            
            //Quantidade de atendimentos e seus repectivos status            
            let countEmAtendimento = 0,
                countListaDeEspera = 0,
                countCancelado = 0,
                countFinalizado = 0
            todosAtendimentos.map(atd => {            
                if(utils.tratamentoStatusAtendimento(atd) === 'Em Atendimento'){
                    countEmAtendimento++
                    cardBodyEmAtendimento.innerHTML = countEmAtendimento
                }else if(utils.tratamentoStatusAtendimento(atd) === 'Lista de espera'){
                    countListaDeEspera++
                    cardBodyEspera.innerHTML = countListaDeEspera
                }else if(utils.tratamentoStatusAtendimento(atd) === 'Finalizado') {
                    countFinalizado++
                    cardBodyFinalizado.innerHTML = countFinalizado
                }else if(utils.tratamentoStatusAtendimento(atd) === 'Cancelado') {
                    countCancelado++
                    cardBodyCancelado.innerHTML = countCancelado
                }                    
            })        
            
            //Lista com todos os serviços cadastrados
            todosServicos.map(servico => {                
                cardBodyTabelServicos.innerHTML += `<tr>
                                                        <td>${servico.nome}</td>
                                                        <td>${servico.descricao}</td>
                                                    </tr>`
            })
        }
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
                            <td>${utils.converterDataHorario(reserva.horario.data)}</td>
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
            
            const selectDataHorario = document.getElementById('selectDataHorario')
            const selectServico = document.getElementById('selectServico')
            const selectCliente = document.getElementById('selectCliente')
            const selectStatus = document.getElementById('selectStatus')

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
                const selectedDataHorario = selectDataHorario.options[selectDataHorario.selectedIndex].value
                const selectedServico = selectServico.options[selectServico.selectedIndex].value                 
                const selectedCliente = selectCliente.options[selectCliente.selectedIndex].value
                const selectedStatus = selectStatus.options[selectStatus.selectedIndex].value                            
                
                const formData = new FormData()
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
                        <td>${reservas.atendente !== null ? reservas.atendente.user.name : 'Atendente removido'}</td>
                        <td>${reservas.servico.nome}</td>
                        <td>${utils.validarUsuario(reservas)}</td>
                        <td>${reservas.horario.data}</td>
                        <td>${utils.tratamentoStatusAtendimento(reservas)}</td>
                        <td>${reservas.obs !== null ? reservas.obs : 'Nenhuma observação'}</td>
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
                                                <label>${reserva.atendente !== null ? reserva.atendente.user.name : 'Atendente removido'}</label>
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
                                                <label>${reserva.cliente !== null ? reserva.cliente.user.name : 'Cliente removido'}</label>
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
                                            <button id="btnModalAlterarReserva-${reserva.id}" type="button" data-dismiss="modal" class="btn btn-primary w-25 btn-cadastrar-reserva">Enviar</button>
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

                    const formData = new FormData()
                    if(selectedAtendente !== "Selecione o Atendente")
                        formData.append('id_atendente', `${selectedAtendente}`)

                    if(selectedDataHorario !== "Selecione a data/hora")
                        formData.append('id_horario', `${selectedDataHorario}`)

                    if(selectedServico !== "Selecione o serviço")
                        formData.append('id_servico', `${selectedServico}`)

                    if(selectedCliente !== "Selecione o cliente")
                        formData.append('id_cliente', `${selectedCliente}`)
                    
                    if(selectedStatus !== "Selecione o status do atendimento")
                        formData.append('status', `${selectedStatus}`)

                    
                    formData.append('obs', `${textAreaObservacao}`)                    
                   
                    var url = `${baseUrl.alterarReserva}/${reserva.id}/editar`
                    
                    const respAlterarReserva = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respAlterarReserva.status === 422){
                        const error = await respAlterarReserva.json() 
                        return alert(error.error)
                    }
                    if(respAlterarReserva.status !== 200) {
                        return alert('Houve um problema ao tentar alterar a reserva, tente novamente')                        
                    }

                    alert('reserva alterado com sucesso')
                    utils.loadEvent()
                    setTimeout(() => {
                        window.location.reload() //Atualiza a pagina
                    }, 2000)                                    
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
                if(respCreateReserva.status === 422){
                    const responseHorarioIndisponiveis = await respCreateReserva.json()                    
                    return alert(responseHorarioIndisponiveis.error)
                }
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
                                
            reserva.map((r, index) => {                
                bodyTableReservaAtendente.innerHTML += `
                                        <tr>
                                            <td>${r.servico.nome}</td>
                                            <td>${r.cliente.user.name}</td>
                                            <td>${r.horario.data}</td>
                                            <td>${utils.tratamentoStatusAtendimento(r)}</td>
                                            <td>${r.obs}</td>
                                            <td class="text-center">
                                                <button data-target="#modalAlterarReserva" data-toggle="modal" type="button" class="btn btn-warning btn-alterar-atd">
                                                    <i class="fas fa-cog icon-alterar-atendimento"></i>
                                                </button>                                                
                                            </td>
                                        </tr>  
                `                
                document.querySelectorAll('.btn-alterar-atd')[index].setAttribute('idReserva', `${r.id}`)  
                alterarAtendimentoAtendente()              
            })
        }        
    }

    const modalAlterarAtendimentoAtendente = () => {
        const divModal = document.createElement('div')                       
        divModal.innerHTML = `
            <div class="modal fade" id="modalAlterarReserva" tabindex="-1" role="dialog" aria-labelledby="modalAlterarReserva" aria-hidden="true">
                <div class="modal-dialog container-modal" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="modalAlterarReserva">Altere a reserva</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>                                    
                                        <td>Status</td>
                                        <td>Obs</td>
                                    </tr>      
                                </thead>      
                                <tbody id="body-alterar-reserva-atendente">
                                    <tr>          
                                        <td>                                
                                            <select id="selectStatus" class="custom-select">
                                                <option selected>Selecione o status</option>
                                                <option value="E">Lista de Espera</option>
                                                <option value="A">Em atendimento</option>
                                                <option value="C">Cancelado</option>
                                                <option value="F">Finalizado</option>
                                            </select>
                                        </td>
                                        <td><input class="form-control" id="obs-modal" /></td>
                                    </tr>   
                                </tbody>
                            </table>   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-alter-atd-atendente close-modal" data-dismiss="modal">Salvar</button>                        
                        </div>
                    </div>
                </div>
            </div>
        `                    
        document.body.appendChild(divModal)        
    }

    const alterarAtendimentoAtendente = async () => {
        const btnAlterarAtendimento = document.querySelectorAll('.btn-alterar-atd')
        btnAlterarAtendimento.forEach(btn => {            
            btn.addEventListener('click', async e =>{             
                const btnAlterAtdAtendente = document.querySelector('.btn-alter-atd-atendente')
                const idReserva          = btn.getAttribute('idreserva')                
                const reservaSelecionado = await getReserva(idReserva)                                                                
                btnAlterAtdAtendente.addEventListener('click', async (e) => {
                    const selectStatus   = document.getElementById('selectStatus')
                    const selectedStatus = selectStatus.options[selectStatus.selectedIndex].value                            
                    const obs            = document.getElementById('obs-modal').value
                    
                    const formData = new FormData()
                    formData.append('status', `${selectedStatus}`)
                    formData.append('id_cliente', `${reservaSelecionado.id_cliente}`)
                    formData.append('id_atendente', `${reservaSelecionado.id_atendente}`)
                    formData.append('id_horario', `${reservaSelecionado.id_horario}`)
                    formData.append('id_servico', `${reservaSelecionado.id_servico}`)                    
                    formData.append('obs', `${obs}`)

                    const url = `${baseUrl.alterarReserva}/${idReserva}/editar`
                    const token = window.localStorage.getItem('token')
                    const respReq = await fetch(url, {
                        method: 'POST',                    
                        body: formData,
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    
                    if(respReq.status !== 200) {
                        return alert('Não foi possível alteral, tente novamente mais tarde')
                    }

                    alert('Reserva alterada com sucesso')
                    utils.loadEvent()
                    setTimeout(() => {
                        window.location.reload() //Atualiza a pagina
                    }, 2000)

                })
                
            })
        })
    }

    const getReserva = async (id) => {
        const url   = `${baseUrl.getReserva}/${id}`
        const token = window.localStorage.getItem('token')
        
        const respReq = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const respGetReserva = await respReq.json()

        return respGetReserva
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
        modalAlterarAtendimentoAtendente,
        cardIndicativosAtendimento,
        filtrarReservas        
    }
}

export default reservas