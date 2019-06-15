import baseUrl from './service';
import utils from './utils'
import cliente from './cliente';
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
                        <td>${utils.tratamentoPerfilGerente(atendente.perfil)}</td>
                        <td><button type="button" data-target="#modalReservaAtendente" data-toggle="modal" class="btn btn-secondary btn-modal-reserva">Reservas</button></td>                    
                    </tr>  
                `
                document.querySelectorAll('.btn-modal-reserva')[index].setAttribute('id', `${atendente.id} modalReservaAtendente`)
                document.querySelectorAll('.btn-modal-reserva')[index].setAttribute('idAtendente', `${atendente.id}`)
            })    
        }        

        openModalReservasAtendente()
    }

    const getAtendente = async (id) => {
        const url   = `${baseUrl.getAtendente}/${id}`
        const token =   window.localStorage.getItem('token')
        const respReq = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })        
        const respAtendente = await respReq.json()

        return respAtendente
    }

    const openModalReservasAtendente = () => { 
        const divModal = utils.modal()                
        
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

                bodyReservaAtendente.innerHTML = ''
                reserva.forEach(r => {                                        
                    bodyReservaAtendente.innerHTML += `
                                <td>${r.cliente !== null ? r.cliente.user.name : 'Cliente removido'}</td>
                                <td>${r.servico.nome}</td>
                                <td>${r.horario.data}</td>
                                <td>${utils.tratamentoStatusAtendimento(r)}</td>
                                <td>${r.servico.descricao}</td>
                    `
                })                                
            })            
        })
    }

    const createAtendente = () => {
        if((document.querySelector('.page-logado-gerente') !== null) ) {

            const btnCadastrarAtendente = document.querySelector('.btn-cadastrar-atendente') 
            if(btnCadastrarAtendente !== null) {

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
    }
  
    const deleteAtendente = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarAtendente   = document.querySelector('.btn-deletar-atendente')    
            const selectAtendenteDelete = document.getElementById('selectAtendenteDelete')   
            if(selectAtendenteDelete === null) 
                return 
            
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
                
                
                alert('Atendente deletado com sucesso')
                utils.loadEvent()
                setTimeout(() => {
                    window.location.reload() //Atualiza a pagina
                }, 2000)
                return 
            })
        }
    }   

    const alterarAtendente = async () => { 
        if(document.getElementById('body-lista-atendentes-dados') !== null) {
            const bodyListaAtendentes = document.getElementById('body-lista-atendentes-dados')
            let todosAtendentes = await loadTodosAtendentes()
            todosAtendentes.map((atendente, index) => {
                bodyListaAtendentes.innerHTML += `
                    <tr>
                        <td>${atendente.user.name}</td>
                        <td>${atendente.user.cpf}</td>
                        <td>${atendente.user.email}</td>
                        <td>${atendente.celular}</td>
                        <td>${utils.tratamentoPerfilGerente(atendente.perfil)}</td>      
                        <td><button data-target="#modalDadosAtendente-${atendente.id}" data-toggle="modal" idAtendente="${atendente.id}" class="btn btn-warning alterar-dados">Alterar</button></td>         
                    </tr>  
                `
            })    
        }        

        openModalDadosAtendente()
    }

    const openModalDadosAtendente = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {


            let dadosAtendentes = await loadTodosAtendentes()
    
            dadosAtendentes.map((atendente) => {
                let status = "";
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
                                    <span aria-hidden="true">&times;</span>
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
                                            <div class="form-group col-md-12">
                                                <label for="exampleInputEmail1">Email</label>
                                                <input type="email" class="form-control" id="alterarEmail-${atendente.id}" aria-describedby="emailHelp" placeholder="Email" value="${atendente.user.email}"">
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
                                        <button id="alterar-dados-atendente-${atendente.id}" type="button" data-dismiss="modal" class="btn btn-primary">Alterar</button>
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
            
            dadosAtendentes.map( (atendente) => {
                var btn = document.querySelector(`#alterar-dados-atendente-${atendente.id}`);
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                 
                    const nomeAtendente    = document.getElementById(`alterarNome-${atendente.id}`).value
                    const telFixo          = document.getElementById(`alterarTelefone-${atendente.id}`).value
                    const celularAtendente = document.getElementById(`alterarCelular-${atendente.id}`).value
                    const emailAtendente   = document.getElementById(`alterarEmail-${atendente.id}`).value
                    const senhaAtendente   = document.getElementById(`alterarSenha-${atendente.id}`).value
                    const cpfAtendente     = document.getElementById(`alterarCpf-${atendente.id}`).value
                    let perfilAtendente    = document.getElementById(`alterarPerfilAtendente-${atendente.id}`);
                    perfilAtendente        = perfilAtendente.options[perfilAtendente.selectedIndex].value;                            
                    const token            = window.localStorage.getItem('token');                    
                    
                    //console.log(`${nomeAtendente} ${telFixo} ${celularAtendente} ${emailAtendente} ${senhaAtendente} ${cpfAtendente} ${perfilAtendente}`)
                    
                    var formData = new FormData();
    
                    if(senhaAtendente != "")
                        formData.append('password', `${senhaAtendente}`)
    
                    if(perfilAtendente != "Selecione o Perfil")
                        formData.append('perfil', `${perfilAtendente}`)
    
                    formData.append('celular', `${celularAtendente}`)
                    formData.append('telefone', `${telFixo}`)
                    formData.append('name', `${nomeAtendente}`)
                    formData.append('email', `${emailAtendente}`)
                    formData.append('cpf', `${cpfAtendente}`)
                   
                    var url = `${baseUrl.alterarAtendente}/${atendente.id}/editar`;
                    
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

    const listaClientes = async () => {                    
        if(document.getElementById('body-lista-clientes') !== null) {
            const bodyListaClientes = document.getElementById('body-lista-clientes')
            let todosClientes = await cliente().loadTodosClientes()
                        
            todosClientes.map((cliente, index) => {
                bodyListaClientes.innerHTML += `
                    <tr>
                        <td>${cliente.user.name !== null ? cliente.user.name : '*****'}</td>                        
                        <td>${cliente.user.cpf !== null ? cliente.user.cpf : 'CPF não cadastrado'}</td>                        
                        <td><button type="button" data-target="#modalAlterarCliente" data-toggle="modal" class="btn btn-secondary btn-modal-alterar-cliente">Alterar Cliente</button></td>                    
                    </tr>  
                `                
                document.querySelectorAll('.btn-modal-alterar-cliente')[index].setAttribute('idAtendente', `${cliente.id}`)
            })    
        }        

        openModalAlterarCliente()
    }

    const openModalAlterarCliente = async ( ) => {
        if(document.getElementById('body-lista-clientes') !== null) {                        
            const divModal = document.createElement('div')                       
            divModal.innerHTML = `
            <div class="modal fade" id="modalAlterarCliente" tabindex="-1" role="dialog" aria-labelledby="modalAlterarCliente" aria-hidden="true">
                <div class="modal-dialog container-modal" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="modalAlterarCliente">Reserva do Atendente</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body table-responsive">
                            <table class="table">
                                
                                <tbody id="body-alterar-cliente">
                                       
                                </tbody>
                            </table>   
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary close-modal" data-dismiss="modal">Fechar</button>                        
                        </div>
                    </div>
                </div>
            </div>
            `
            document.body.appendChild(divModal)

            const bodyModalAlterarCliente = document.getElementById('body-alterar-cliente')
            const btnModalAlterarCliente = document.querySelectorAll('.btn-modal-alterar-cliente')

            btnModalAlterarCliente.forEach(btn => {
                btn.addEventListener('click', async e => {
                    const idCliente = btn.getAttribute('idatendente')                                        
                    let clienteSelecionado = await cliente().loadTodosClientes(idCliente)
                    
                    bodyModalAlterarCliente.innerHTML = `
                        <form>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">Nome</label>
                                    <input type="text" class="form-control" id="alterarNomeCliente" aria-describedby="emailHelp" placeholder="Nome" value="${clienteSelecionado.user.name}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">Cpf</label>
                                    <input type="text" class="form-control" id="alterarCpfCliente" aria-describedby="emailHelp" placeholder="Cpf" value="${clienteSelecionado.user.cpf}"">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">Email</label>
                                    <input type="email" class="form-control" id="alterarEmailCliente" aria-describedby="emailHelp" placeholder="Email" value="${clienteSelecionado.user.email}"">
                                </div>                                
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">Celular</label>
                                    <input type="text" class="form-control" id="alterarCelularCliente" aria-describedby="emailHelp" placeholder="Celular" value="${clienteSelecionado.celular}"">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="exampleInputEmail1">Telefone fixo</label>
                                    <input type="text" class="form-control" id="alterarTelefoneCliente" aria-describedby="emailHelp" placeholder="Telefone" value="${clienteSelecionado.telefone}">
                                </div>
                            </div>                       
                            <div class="w-100 d-flex justify-content-end">
                                <button id="alterar-dados-cliente" data-dismiss="modal" type="button" data-dismiss="modal" class="btn btn-primary">Alterar</button>
                            </div>
                        </form>
                    ` 
                        const btnAlterarDadosCliente = document.getElementById('alterar-dados-cliente')
                        btnAlterarDadosCliente.addEventListener('click', async e => {
                            const nomeCliente            = document.getElementById(`alterarNomeCliente`).value
                            const telFixoCliente         = document.getElementById(`alterarTelefoneCliente`).value
                            const celularCliente         = document.getElementById(`alterarCelularCliente`).value
                            const emailCliente           = document.getElementById(`alterarEmailCliente`).value                    
                            const cpfCliente             = document.getElementById(`alterarCpfCliente`).value                       
                            const token                  = window.localStorage.getItem('token')

                            var formData = new FormData();
                            formData.append('celular', `${celularCliente}`)
                            formData.append('telefone', `${telFixoCliente}`)
                            formData.append('name', `${nomeCliente}`)
                            formData.append('email', `${emailCliente}`)
                            formData.append('cpf', `${cpfCliente}`)

                            var url = `${baseUrl.alterarCliente}/${idCliente}/editar`;
                            const respAlterarCliente = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: formData
                            })                            
                            if(respAlterarCliente.status !== 200) {
                                return alert('Houve um problema ao tentar alterar o cliente, tente novamente')
                            }

                            alert('Cliente alterado com sucesso')
                            utils.loadEvent()
                            setTimeout(() => {
                                window.location.reload() //Atualiza a pagina
                            }, 2000)
                        })
                    })
            })                    
        }    
    }

    return {
        loadTodosAtendentes,
        listaAtendentes,
        createAtendente,
        deleteAtendente,
        alterarAtendente,
        getAtendente,
        listaClientes
    }    
}

export default atendente

