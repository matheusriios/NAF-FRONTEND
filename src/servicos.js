import baseUrl from './service';

const servicos = ( ) => {

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

    const alterarServico = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {
            const bodyListaServico = document.getElementById('body-lista-servico')
            let todosServico = await loadTodosServicos()
            todosServico.map((servico, index) => {
                console.log(servico)
                bodyListaServico.innerHTML += `
                    <tr>
                        <td>${servico.nome}</td>
                        <td>${servico.descricao}</td>
                        <td><button data-target="#modalServicos-${servico.id}" data-toggle="modal" idServico="${servico.id}" class="btn btn-warning alterar-dados">Alterar</button></td>         
                    </tr>  
                `
            }) 
        }        

        openModalServico()
    }

    const openModalServico = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {


            let dadosServicos = await loadTodosServicos()
    
            dadosServicos.map((servico) => {
               
                const divModal = document.createElement('div')                       
                divModal.innerHTML = `
                    <div class="modal fade" id="modalServicos-${servico.id}" tabindex="-1" role="dialog" aria-labelledby="modalServicos" aria-hidden="true">
                        <div class="modal-dialog container-modal" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="modalReservaAtendente">${servico.nome}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Nome</label>
                                                <input type="text" class="form-control" id="alterarNomeServico-${servico.id}" aria-describedby="emailHelp" placeholder="Nome" value="${servico.nome}">
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="exampleInputEmail1">Cpf</label>
                                                <input type="text" class="form-control" id="alterarDescricaoServico-${servico.id}" aria-describedby="emailHelp" placeholder="Descrição" value="${servico.descricao}"">
                                            </div>
                                        </div>                          
                                        <button id="alterar-servicos-${servico.id}" type="button" class="btn btn-primary">Alterar</button>
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
            
            dadosServicos.map( (servico) => {
                var btn = document.querySelector(`#alterar-servicos-${servico.id}`);
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                 
                    const nomeServico      = document.getElementById(`alterarNomeServico-${servico.id}`).value;
                    const descricaoServico = document.getElementById(`alterarDescricaoServico-${servico.id}`).value;                        
                    const token     = window.localStorage.getItem('token'); 
                    console.log(descricaoServico + " " + nomeServico);
                    var formData = new FormData();
                    //if(nomeServico != "")
                        formData.append('nome', `${nomeServico}`);

                    //if(descricaoServico != "")
                        formData.append('descricao', `${descricaoServico}`);
                                      
                    var url = `${baseUrl.alterarServico}/${servico.id}/editar`;
                    
                    const respCreateAtendete = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respCreateAtendete.status === 200) {
                        alert('Serviço alterado com sucesso')
                        utils.loadEvent()
                        setTimeout(() => {
                            window.location.reload() //Atualiza a pagina
                        }, 2000)
                        return 
                    }
                    return alert('Houve um problema ao tentar alterar o Serviço, tente novamente')
                    
                })
            })

        }
    }

    return {
        loadTodosServicos,
        createServico,
        alterarServico
    }
}

export default servicos;