import baseUrl from './service';
import utils from './utils'
const atendente = () => {
        
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

    const loadTodosServicos = async () => {
        const token = window.localStorage.getItem('token')
        const response = await fetch(`${baseUrl.listaServicos}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const body = await response.json()  
        
        return body
    }

    const loadTodosClientes = async () => {
        const token = window.localStorage.getItem('token')
        const response = await fetch(`${baseUrl.listaClientes}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const body = await response.json()  
        
        return body
    }    

    const loadTodosHorarios = async () => {
        const token = window.localStorage.getItem('token')
        const response = await fetch(`${baseUrl.listaHorarios}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const body = await response.json()  
        
        return body
    }

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
        const divModal = document.createElement('div')                       
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
                                        <td>Data</td>
                                        <td>Status</td>
                                        <td>Obs</td>
                                    </tr>      
                                </thead>      
                                <tbody id="body-reserva-atendente">
                                       
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
        
        const token    = window.localStorage.getItem('token')
        const bodyReservaAtendente = document.getElementById('body-reserva-atendente')
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
                let { reserva } = await respUser.json()  
                
                if(reserva.length === 0)
                    return bodyReservaAtendente.innerHTML = ``

                    console.log(reserva)
                reserva.forEach(r => {                                        
                    bodyReservaAtendente.innerHTML += `
                                <td>${r.cliente !== null ? r.cliente.user.name : 'Cliente removido'}</td>
                                <td>${r.servico.nome}</td>
                                <td>${r.horario.data}</td>
                                <td>${r.status}</td>
                                <td>${r.servico.descricao}</td>
                    `
                })                                
            })            
        })
    }

    const createCliente = () => {
        
        if((document.querySelector('.page-logado-gerente') !== null) ) {            
            const btnCadastrarCliente = document.getElementById('btn-cadastrar-cliente')
            
            btnCadastrarCliente.addEventListener('click', async (e) => {
                e.preventDefault()
                
                const nomeCliente      = document.getElementById('nomeCliente').value
                const telFixoCliente   = document.getElementById('telCliente').value
                const celularCliente   = document.getElementById('celularCliente').value
                const emailCliente     = document.getElementById('emailCliente').value
                const senhaCliente     = document.getElementById('senhaCliente').value        
                const cpfCliente     = document.getElementById('cpfCliente').value        
                if(nomeCliente === '' || cpfCliente === '' || telFixoCliente === '' || celularCliente === '' || emailCliente === '' || senhaCliente === '' ) {
                    return alert('Todos os campos são obrigatorios')
                }

                const formData = new FormData();
                formData.append('name', `${nomeCliente}`)
                formData.append('telefone', `${telFixoCliente}`)
                formData.append('celular', `${celularCliente}`)                
                formData.append('email', `${celularCliente}`)
                formData.append('password', `${senhaCliente}`)
                formData.append('cpfCliente', `${cpfCliente}`)

                const respCreateCliente = await fetch(`${baseUrl.createCliente}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',                        
                    },
                    body: formData
                })
                
                if(respCreateCliente.status === 200) {
                    alert('Serviço cadastrado com sucesso')
                    utils.loadEvent()
                    setTimeout(() => {
                        window.location.reload() //Atualiza a pagina
                    } , 2000)
                    return 
                }
                
                return alert('Houve um problema ao tentar cadastrar, tente novamente')                
            })
        }        

    }

    const createAtendente = () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {

            const btnCadastrarAtendente = document.querySelector('.btn-cadastrar-atendente')                
            btnCadastrarAtendente.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const nomeAtendente    = document.getElementById('nomeAtendente').value
                const telFixo          = document.getElementById('telAtendente').value
                const celularAtendente = document.getElementById('celularAtendente').value
                const emailAtendente   = document.getElementById('emailAtendente').value
                const senhaAtendente   = document.getElementById('senhaAtendente').value
                const cpfAtendente   = document.getElementById('cpfAtendente').value
                let perfilAtendente    = document.getElementById('perfilAtendente');
                perfilAtendente        = perfilAtendente.options[perfilAtendente.selectedIndex].value;                            
                const token            = window.localStorage.getItem('token');                    
                
                if(nomeAtendente === '' || celularAtendente === '' || emailAtendente === '' || senhaAtendente === '' || perfilAtendente === '' ) {
                    return alert('Todos os campos são obrigatorios')
                }

                const formData = new FormData();
                formData.append('celular', `${celularAtendente}`)
                formData.append('telefone', `${telFixo}`)
                formData.append('perfil', `${perfilAtendente}`)
                formData.append('name', `${nomeAtendente}`)
                formData.append('email', `${emailAtendente}`)
                formData.append('password', `${senhaAtendente}`)
                formData.append('cpf', `${cpfAtendente}`)
                
                formData.forEach(f => console.log(f))
                const respCreateAtendete = await fetch(`${baseUrl.createAtendente}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                
                if(respCreateAtendete.status === 200) {
                    alert('Atendente cadastrado com sucesso')
                    utils.loadEvent()
                    setTimeout(() => {
                        window.location.reload() //Atualiza a pagina
                    }, 2000)
                    return 
                }
                return alert('Houve um problema ao tentar cadastrar, tente novamente')
            })
        }
    }

    const createHorario = () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {
            const btnCadastrarHorario = document.querySelector('.btn-cadastrar-horario');
            
            btnCadastrarHorario.addEventListener('click', async (e) => {
                e.preventDefault();
                const dia = document.getElementById('dia').value
                const mes = document.getElementById('mes').value
                const ano = document.getElementById('ano').value
                const horario = document.getElementById('horario').value            
                const data = `${ano}-${mes}-${dia}`                                

                if(dia !== '' || mes !== '' || ano !== '' || horario !== '') {
                    const formData = new FormData()                
                    formData.append('data', `${data} ${horario}`)      
                    const respCreateHorario = await fetch(`${baseUrl.createHorario}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',  
                            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        },
                        body: formData
                    })

                    if(respCreateHorario.status === 200){
                        alert('Serviço cadastrado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                }                                

                return alert('Não foi possível efetuar o cadastro, tente novamente')
            })
        }
    }

    const createServico = () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {
            const btnCadastrarHorario = document.querySelector('.btn-cadastrar-servico');
            
            btnCadastrarHorario.addEventListener('click', async (e) => {
                e.preventDefault();
                const nomeServico = document.getElementById('nameServico').value
                const documentos = document.getElementById('documentos').value                
                                    

                if(nomeServico !== '' || documentos !== '') {
                    const formData = new FormData()                
                    formData.append('nome', `${nomeServico}`)
                    formData.append('descricao', `${documentos}`)
                    const respCreateServico = await fetch(`${baseUrl.createServico}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',  
                            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        },
                        body: formData
                    })
                    
                    if(respCreateServico.status === 200){
                        alert('Serviço cadastrado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                    
                    return alert('Não foi possível efetuar o cadastro, tente novamente')                    
                }                                                
            })
        }
    }

    const createReserva = async () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {
            const loadAtendentes = await loadTodosAtendentes()
            const loadHorarios   = await loadTodosHorarios()
            const loadServicos   = await loadTodosServicos()
            const loadClientes   = await loadTodosClientes()
            
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
    
    const deleteAtendente = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarAtendente   = document.querySelector('.btn-deletar-atendente')    
            const selectAtendenteDelete = document.getElementById('selectAtendenteDelete')                        
            const todosAtendentes       = await loadTodosAtendentes()                    
            todosAtendentes.forEach(atendente => {
                selectAtendenteDelete.innerHTML += `<option value=${atendente.id} >${atendente.user.name}</option>                `
            })
            btnDeletarAtendente.addEventListener('click', async (e) => {
                e.preventDefault()
                const selectedAtendente = selectAtendenteDelete.options[selectAtendenteDelete.selectedIndex].value                           
                
                const respDeleteAtendente = await fetch(`${baseUrl.deleteAtendente}/${selectedAtendente}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }             
                })
                if(respDeleteAtendente.status !== 200)                    
                    return alert('Não foi possível deletar o atendente, tente novamente')
                
                
                alert('Serviço cadastrado com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)
                return 
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

    const deleteCliente = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarReserva   = document.querySelector('.btn-deletar-cliente')    
            const selectClienteDelete = document.getElementById('selectClienteDelete')                                                
            const todosCliente = await loadTodosClientes()            
            todosCliente.forEach(cliente => {            
                selectClienteDelete.innerHTML += `<option value=${cliente.id}>${cliente.user.name}</option>`
            })
            btnDeletarReserva.addEventListener('click', async (e) => {
                e.preventDefault()
                const selectedCliente = selectClienteDelete.options[selectClienteDelete.selectedIndex].value    
                
                const respDeleteCliente = await fetch(`${baseUrl.deleteCliente}/${selectedCliente}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                })
    
                if(respDeleteCliente.status !== 200)    
                    return alert('Não foi possível deletar a tarefa')
                
                alert('Cliente deletado com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)
            })
        }
    }

    const deleteHorario = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarReserva   = document.querySelector('.btn-deletar-horario')    
            const selectHorarioDelete = document.getElementById('selectHorarioDelete')                                                
            const todosHorarios = await loadTodosHorarios()
            console.log(todosHorarios)
            todosHorarios.forEach(horario => {            
                selectHorarioDelete.innerHTML += `<option value=${horario.id}>${horario.data}</option>`
            })
            btnDeletarReserva.addEventListener('click', async (e) => {
                e.preventDefault()
                const selectedHarario = selectHorarioDelete.options[selectHorarioDelete.selectedIndex].value    
                
                const respDeleteHorario = await fetch(`${baseUrl.deleteHorario}/${selectedHarario}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                })
    
                if(respDeleteHorario.status !== 200)    
                    return alert('Não foi possível deletar a tarefa')
                
                alert('Horario deletado com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)
            })
        }
    }


    return {        
        listaAtendentes,
        listaReservas,
        createAtendente,
        createCliente,
        createHorario,
        createServico,
        createReserva,
        deleteAtendente,
        deleteReserva,
        deleteCliente,
        deleteHorario
    }    
}

export default atendente

