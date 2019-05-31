import baseUrl from './service';
import utils from './utils';
const cliente = () => {

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
                formData.append('email', `${emailCliente}`)
                formData.append('password', `${senhaCliente}`)
                formData.append('cpf', `${cpfCliente}`)

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


    const alterarClientes = async () => { 
        if(document.getElementById('body-lista-cliente-dados') !== null) {
            const bodyListaClientes = document.getElementById('body-lista-cliente-dados')
            let todosClietes = await loadTodosClientes()
            todosClietes.map((cliente, index) => {
                bodyListaClientes.innerHTML += `
                    <tr data-target="#modalDadosCliente-${cliente.id}" data-toggle="modal" idCliente="${cliente.id} class="alterar-dados">
                        <td>${cliente.user.name}</td>
                        <td>${cliente.user.cpf}</td>
                        <td>${cliente.user.email}</td>
                        <td>${cliente.telefone}</td>               
                        <td>${cliente.celular}</td>
                    </tr>  
                `
            })    
        }        

        openModalDadosClientes()
    }

    const openModalDadosClientes = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {

            let todosClietes = await loadTodosClientes()
    
            todosClietes.map((cliente) => {
               
                const divModal = document.createElement('div')                       
                divModal.innerHTML = `
                    <div class="modal fade" id="modalDadosCliente-${cliente.id}" tabindex="-1" role="dialog" aria-labelledby="modalDadosCliente" aria-hidden="true">
                        <div class="modal-dialog container-modal" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="modalReservaAtendente">Dados do Atendente ${cliente.user.name}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Nome</label>
                                                <input type="text" class="form-control" id="alterarNomeCliente-${cliente.id}" aria-describedby="emailHelp" placeholder="Nome" value="${cliente.user.name}">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Cpf</label>
                                                <input type="text" class="form-control" id="alterarCpfCliente-${cliente.id}" aria-describedby="emailHelp" placeholder="Cpf" value="${cliente.user.cpf}"">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Email</label>
                                                <input type="email" class="form-control" id="alterarEmailCliente-${cliente.id}" aria-describedby="emailHelp" placeholder="Email" value="${cliente.user.email}"">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputPassword1">Senha</label>
                                                <input type="text" class="form-control" id="alterarSenhaCliente-${cliente.id}" placeholder="Senha">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Celular</label>
                                                <input type="text" class="form-control" id="alterarCelularCliente-${cliente.id}" aria-describedby="emailHelp" placeholder="Celular" value="${cliente.celular}"">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Telefone fixo</label>
                                                <input type="text" class="form-control" id="alterarTelefoneCliente-${cliente.id}" aria-describedby="emailHelp" placeholder="Telefone" value="${cliente.telefone}">
                                            </div>
                                        </div>                       
                                        <button id="alterar-dados-cliente-${cliente.id}" type="button" class="btn btn-primary">Alterar</button>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>                        
                                </div>
                            </div>
                        </div>
                    </div>
                `          
                document.body.appendChild(divModal);
            });
            
            todosClietes.map( (cliente) => {
                var btn = document.querySelector(`#alterar-dados-cliente-${cliente.id}`);
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                 
                    const nomeCliente   = document.getElementById(`alterarNomeCliente-${cliente.id}`).value
                    const telFixoCliente        = document.getElementById(`alterarTelefoneCliente-${cliente.id}`).value
                    const celularCliente = document.getElementById(`alterarCelularCliente-${cliente.id}`).value
                    const emailCliente   = document.getElementById(`alterarEmailCliente-${cliente.id}`).value
                    const senhaCliente   = document.getElementById(`alterarSenhaCliente-${cliente.id}`).value
                    const cpfCliente     = document.getElementById(`alterarCpfCliente-${cliente.id}`).value                       
                    const token            = window.localStorage.getItem('token');                    
                    
                    var formData = new FormData();
    
                    if(senhaCliente != "")
                        formData.append('password', `${senhaCliente}`)    
                   
                    formData.append('celular', `${celularCliente}`)
                    formData.append('telefone', `${telFixoCliente}`)
                    formData.append('name', `${nomeCliente}`)
                    formData.append('email', `${emailCliente}`)
                    formData.append('cpf', `${cpfCliente}`)
                   
                    var url = `${baseUrl.alterarCliente}/${cliente.id}/editar`;
                    const respCreateAtendete = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respCreateAtendete.status === 200) {
                        alert('Cliente alterado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                    return alert('Houve um problema ao tentar alterar o Cliente, tente novamente')
                    
                })
            })

        }
    }

    return {
        loadTodosClientes,
        createCliente,
        deleteCliente,
        alterarClientes
    }
}
export default cliente;