import baseUrl from './service';

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
            //console.log(todosHorarios)
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
        loadTodosHorarios,
        createHorario,
        deleteHorario
    }
}

export default horarios;