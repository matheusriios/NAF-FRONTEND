import baseUrl from './service';
import utils from './utils';
import userAuth from './userAuth'
const cliente = () => {

    const loadTodosClientes = async (id) => {
        const token = window.localStorage.getItem('token')
        let url = id ?  `${baseUrl.listaClientes}/${id}` : `${baseUrl.listaClientes}`;
        const response = await fetch(url, {
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
        if((document.querySelector('.page-logado-gerente') !== null || document.querySelector('.page-logado-atendente') !== null) ) {            
            const btnCadastrarCliente = document.getElementById('btn-cadastrar-cliente')            
            if(btnCadastrarCliente !== null){
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
                        alert('Cliente cadastrado com sucesso')
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

    }

    const deleteCliente = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarReserva   = document.querySelector('.btn-deletar-cliente')    
            const selectClienteDelete = document.getElementById('selectClienteDelete') 
            if(selectClienteDelete === null)
                return                                                
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

    const listarCliente = async ( ) => {
        if(document.getElementById('body-lista-pagecliente-dados') !== null) {
            const bodyListaClientes = document.getElementById('body-lista-pagecliente-dados')
            const userAuthenticated = await userAuth()
            let cliente = await loadTodosClientes(userAuthenticated.cliente.id)
        
            bodyListaClientes.innerHTML += `
                <tr data-target="#modalDadosCliente-${cliente.id}" data-toggle="modal" idCliente="${cliente.id} class="alterar-dados">
                    <td>${cliente.user.name}</td>
                    <td>${cliente.user.cpf}</td>
                    <td>${cliente.user.email}</td>
                    <td>${cliente.telefone}</td>               
                    <td>${cliente.celular}</td>
                </tr>  
            `             
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
    
    const alterarCliente = async ( ) => {
        if(document.getElementById('body-alterar-pagecliente-dados') !== null) {
            const bodyListaClientes = document.getElementById('body-alterar-pagecliente-dados');
            const userAuthenticated = await userAuth()
            let cliente = await loadTodosClientes(userAuthenticated.cliente.id)
        
            bodyListaClientes.innerHTML += `
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
                            <input type="password" class="form-control" id="alterarSenhaCliente-${cliente.id}" placeholder="Senha">
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
                    <button id="alterar-dados-cliente-${cliente.id}" type="button" data-dismiss="modal" class="btn btn-primary">Alterar</button>
                </form>
            ` 
            var btn = document.querySelector(`#alterar-dados-cliente-${cliente.id}`);
            btn.addEventListener('click', (e)=>{
                e.preventDefault()
                eventoClickAlterarCliente(cliente);
            });
            
        }    
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
                                                <input type="password" class="form-control" id="alterarSenhaCliente-${cliente.id}" placeholder="Senha">
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
                                        <button id="alterar-dados-cliente-${cliente.id}" data-dismiss="modal" type="button" class="btn btn-primary">Alterar</button>
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
                btn.addEventListener('click', (e)=>{
                    e.preventDefault()
                    eventoClickAlterarCliente(cliente);
                });
            })

           

        }
    }

    const excluirContarCliente  = async ( ) => {
        if(document.getElementById('body-excluir-conta-pagecliente') !== null) {
            const userAuthenticated = await userAuth()
            let cliente = await loadTodosClientes(userAuthenticated.cliente.id)
            const bodyListaClientes = document.getElementById('body-excluir-conta-pagecliente')            
          
            bodyListaClientes.innerHTML += `
                <tr>
                    <td>${cliente.user.name}</td>
                    <td>${cliente.user.cpf}</td>
                    <td>${cliente.user.email}</td>
                    <td><button data-target="#modalDadosCliente-${cliente.id}" data-toggle="modal" idCliente="${cliente.id}" class="alterar-dados btn btn-danger">Excluir conta</button></td>                  
                </tr>  
            `
            
        }
        
        openModalConfirmarExclusao()
       
    }

    const openModalConfirmarExclusao = async ( ) =>{
        if(document.querySelector('#body-excluir-conta-pagecliente') !== null) {
            const userAuthenticated = await userAuth()
            let cliente = await loadTodosClientes(userAuthenticated.cliente.id)

            const divModal = document.createElement('div')                       
            divModal.innerHTML = `
                <div class="modal fade" id="modalDadosCliente-${cliente.id}" tabindex="-1" role="dialog" aria-labelledby="modalDadosCliente" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="modalReservaAtendente">Realmente deseja excluir a sua conta ${cliente.user.name} ?</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="exampleInputEmail1">Informe seu CPF caso queria excluir sua conta</label>
                                            <input type="text" class="form-control" id="cpf-confirmacao-excluir-conta-${cliente.id}" aria-describedby="emailHelp" placeholder="Cpf">
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>                        
                                <button id="btn-confirmar-exclusao-conta-${cliente.id}" type="button" class="btn btn-danger">Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            `          
            document.body.appendChild(divModal);
            const excluir = document.querySelector(`#btn-confirmar-exclusao-conta-${cliente.id}`)

            excluir.addEventListener('click', async (e)=>{
                e.preventDefault();
                const cpfCliente = document.getElementById(`cpf-confirmacao-excluir-conta-${cliente.id}`).value;
                const token            = window.localStorage.getItem('token');        
                var url = `${baseUrl.deleteCliente}/${cliente.id}`;

                if(cpfCliente === cliente.user.cpf ){                    
                    const respExcluirCliente = await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })

                    if(respExcluirCliente.status === 200) {
                        alert('Conta excluida com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.href = "http://localhost:8080";
                        }, 2000)
                        return 
                    }
                    
                } else {
                    alert('Cpf incorreto, tente novamente');
                }

            })
        }
    }

    const eventoClickAlterarCliente = async ( cliente ) => {
        
        const nomeCliente   = document.getElementById(`alterarNomeCliente-${cliente.id}`).value
        const telFixoCliente        = document.getElementById(`alterarTelefoneCliente-${cliente.id}`).value
        const celularCliente = document.getElementById(`alterarCelularCliente-${cliente.id}`).value
        const emailCliente   = document.getElementById(`alterarEmailCliente-${cliente.id}`).value
        const senhaCliente   = document.getElementById(`alterarSenhaCliente-${cliente.id}`).value
        const cpfCliente     = document.getElementById(`alterarCpfCliente-${cliente.id}`).value                       
        const token            = window.localStorage.getItem('token');                    
        
        var formData = new FormData();
      
        if(senhaCliente) {
            formData.append('password', `${senhaCliente}`)
        }
        
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
    }

    return {
        loadTodosClientes,
        createCliente,
        listarCliente,
        deleteCliente,
        alterarClientes,
        alterarCliente,
        excluirContarCliente,
    }
}
export default cliente;