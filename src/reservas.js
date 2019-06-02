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
        //openModalDadosReservas()
    }

    const openModalDadosReservas = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {


            let dadosAtendentes = await loadTodosAtendentes()
    
            dadosAtendentes.map((atendente) => {
                let status = ""
                if (atendente.perfil === "G") {
                    status = "Gerente"
                } else {
                    status = "Atendente"
                }
                const divModal = document.createElement('div')                       
                divModal.innerHTML = `
                    <div class="modal fade" id="modalDadosAtendente-${atendente.id}" tabindex="-1" role="dialog" aria-labelledby="modalDadosAtendente" aria-hidden="true">
                        <div class="modal-dialog container-modal" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="modalReservaAtendente">Dados do Atendente ${atendente.user.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Nome</label>
                                                <input type="text" class="form-control" id="alterarNome-${atendente.id}" aria-describedby="emailHelp" placeholder="Nome" value="${atendente.user.name}">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Cpf</label>
                                                <input type="text" class="form-control" id="alterarCpf-${atendente.id}" aria-describedby="emailHelp" placeholder="Cpf" value="${atendente.user.cpf}"">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Email</label>
                                                <input type="email" class="form-control" id="alterarEmail-${atendente.id}" aria-describedby="emailHelp" placeholder="Email" value="${atendente.user.email}"">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputPassword1">Senha</label>
                                                <input type="text" class="form-control" id="alterarSenha-${atendente.id}" placeholder="Senha">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Celular</label>
                                                <input type="text" class="form-control" id="alterarCelular-${atendente.id}" aria-describedby="emailHelp" placeholder="Celular" value="${atendente.celular}"">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Telefone fixo</label>
                                                <input type="text" class="form-control" id="alterarTelefone-${atendente.id}" aria-describedby="emailHelp" placeholder="Telefone" value="${atendente.telefone}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="exampleInputPassword1">Perfil atual ${status}</label>
                                            <select id="alterarPerfilAtendente-${atendente.id}" class="custom-select">
                                                <option selected>Selecione o Perfil</option>
                                                <option value="G">Gerente</option>
                                                <option value="U">Atendente</option>
                                            </select>
                                        </div>                            
                                        <button id="alterar-dados-atendente-${atendente.id}" type="button" class="btn btn-primary">Alterar</button>
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
            
            dadosAtendentes.map( (atendente) => {
                var btn = document.querySelector(`#alterar-dados-atendente-${atendente.id}`)
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                 
                    const nomeAtendente    = document.getElementById(`alterarNome-${atendente.id}`).value
                    const telFixo          = document.getElementById(`alterarTelefone-${atendente.id}`).value
                    const celularAtendente = document.getElementById(`alterarCelular-${atendente.id}`).value
                    const emailAtendente   = document.getElementById(`alterarEmail-${atendente.id}`).value
                    const senhaAtendente   = document.getElementById(`alterarSenha-${atendente.id}`).value
                    const cpfAtendente     = document.getElementById(`alterarCpf-${atendente.id}`).value
                    let perfilAtendente    = document.getElementById(`alterarPerfilAtendente-${atendente.id}`)
                    perfilAtendente        = perfilAtendente.options[perfilAtendente.selectedIndex].value                            
                    const token            = window.localStorage.getItem('token')                    
                    
                    //console.log(`${nomeAtendente} ${telFixo} ${celularAtendente} ${emailAtendente} ${senhaAtendente} ${cpfAtendente} ${perfilAtendente}`)
                    
                    var formData = new FormData()
    
                    if(senhaAtendente != "")
                        formData.append('password', `${senhaAtendente}`)
    
                    if(perfilAtendente != "Selecione o Perfil")
                        formData.append('perfil', `${perfilAtendente}`)
    
                    formData.append('celular', `${celularAtendente}`)
                    formData.append('telefone', `${telFixo}`)
                    formData.append('name', `${nomeAtendente}`)
                    formData.append('email', `${emailAtendente}`)
                    formData.append('cpf', `${cpfAtendente}`)
                   
                    var url = `${baseUrl.alterarAtendente}/${atendente.id}/editar`
                    
                    const respCreateAtendete = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respCreateAtendete.status === 200) {
                        alert('Atendente alterado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                    return alert('Houve um problema ao tentar alterar o atendente, tente novamente')
                    
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
                    console.log(r);
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