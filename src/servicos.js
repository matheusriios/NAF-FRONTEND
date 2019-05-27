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


    return {
        loadTodosServicos,
        createServico
    }
}

export default servicos;