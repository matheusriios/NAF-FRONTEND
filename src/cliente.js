import baseUrl from './service';
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

    return {
        loadTodosClientes,
        createCliente,
        deleteCliente
    }
}
export default cliente;