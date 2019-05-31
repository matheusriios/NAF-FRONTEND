import baseUrl from './service';
import utils from './utils';

const horarios = ( ) => {

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

    const deleteHorario = async () => {
        if(document.querySelector('.page-logado-gerente') !== null) {
            const btnDeletarReserva   = document.querySelector('.btn-deletar-horario')    
            const selectHorarioDelete = document.getElementById('selectHorarioDelete')                                                
            const todosHorarios = await loadTodosHorarios()
    
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

    const alterarHorario = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {
            const bodyListaServico = document.getElementById('body-lista-horario');
            let todosHorarios = await loadTodosHorarios()
            todosHorarios.map((horario, index) => {
                const agendamento = horario.data.split(' ');
                
                bodyListaServico.innerHTML += `
                    <tr>
                        <td>${agendamento[0]}</td>
                        <td>${agendamento[1]}</td>
                        <td><button data-target="#modalHorario-${horario.id}" data-toggle="modal" idHorario="${horario.id}" class="btn btn-warning alterar-dados">Alterar</button></td>         
                    </tr>  
                `
            }) 
        }        

        openModalHorario()
    }

    const openModalHorario = async () => { 
        if(document.querySelector('.page-logado-gerente') !== null) {

            let dadosHorarios = await loadTodosHorarios()
    
            dadosHorarios.map((horario) => {
               const agendamento = horario.data.split(' ');
               const data = agendamento[0].split('-');
                const divModal = document.createElement('div')                       
                divModal.innerHTML = `
                    <div class="modal fade" id="modalHorario-${horario.id}" tabindex="-1" role="dialog" aria-labelledby="modalHorario" aria-hidden="true">
                        <div class="modal-dialog container-modal" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="modalReservaAtendente">${horario.data}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="form-row">
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">Dia</label>
                                                <input type="text" class="form-control" id="alterarDiaHorario-${horario.id}" aria-describedby="emailHelp" placeholder="Dia" value="${data[2]}">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">Mes</label>
                                                <input type="text" class="form-control" id="alterarMesHorario-${horario.id}" aria-describedby="emailHelp" placeholder="Mes" value="${data[1]}">
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="exampleInputEmail1">Ano</label>
                                                <input type="text" class="form-control" id="alterarAnoHorario-${horario.id}" aria-describedby="emailHelp" placeholder="Ano" value="${data[0]}">
                                            </div>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-12">
                                                <label for="exampleInputEmail1">Horario</label>
                                                <input type="text" class="form-control" id="alterarHorarioHorario-${horario.id}" aria-describedby="emailHelp" placeholder="Ano" value="${agendamento[1]}">
                                            </div>
                                        </div>                     
                                        <button id="alterar-horario-${horario.id}" type="button" class="btn btn-primary">Alterar</button>
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
            
            dadosHorarios.map( (horario) => {
                var btn = document.querySelector(`#alterar-horario-${horario.id}`);
                btn.addEventListener('click', async (e)=>{
                    e.preventDefault()
                 
                    const dia      = document.getElementById(`alterarDiaHorario-${horario.id}`).value;
                    const mes = document.getElementById(`alterarMesHorario-${horario.id}`).value;                        
                    const ano      = document.getElementById(`alterarAnoHorario-${horario.id}`).value;
                    const horas     = document.getElementById(`alterarHorarioHorario-${horario.id}`).value;
                    const token     = window.localStorage.getItem('token'); 
                   
                    var data = "";
                    data = `${ano}-${mes}-${dia} ${horas}`

                    var formData = new FormData();

                    if(data != "")
                        formData.append('data', `${data}`);

                                      
                    var url = `${baseUrl.alterarHorario}/${horario.id}/editar`;
                    
                    const respCreateAtendete = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    })
                    
                    if(respCreateAtendete.status === 200) {
                        alert('Horario alterado com sucesso')
                        $(`#modalHorario-${horario.id}`).modal('hide')
                        utils.loadEvent()
                        window.location.reload() //Atualiza a pagina
                        return 
                    }
                    return alert('Houve um problema ao tentar alterar o Horario, tente novamente')
                    
                })
            })

        }
    }

    return {
        loadTodosHorarios,
        createHorario,
        deleteHorario,
        alterarHorario
    }
}

export default horarios;