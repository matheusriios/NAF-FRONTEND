const baseUrl = 'http://localhost:8000';

const endPoints = {
    usuarioAutenticado: `${baseUrl}/api/v1/auth/me`,
    authUsuario: `${baseUrl}/oauth/token`,
    logout: `${baseUrl}/api/v1/auth/logout`,

    listarAtendentes: `${baseUrl}/api/v1/atendentes`,
    listaHorarios: `${baseUrl}/api/v1/horarios`,
    listaServicos: `${baseUrl}/api/v1/servicos`,
    listaServicos: `${baseUrl}/api/v1/servicos`,
    listaClientes: `${baseUrl}/api/v1/clientes`,    
    listaReservas: `${baseUrl}/api/v1/reservas`,    

    //localhost:8000/api/v1/atendentes/;id
    getAtendente: `${baseUrl}/api/v1/atendentes`,
    
    createAtendente: `${baseUrl}/api/v1/atendentes`,
    createCliente: `${baseUrl}/api/v1/clientes`,
    createHorario: `${baseUrl}/api/v1/horarios`,
    createServico: `${baseUrl}/api/v1/servicos`,
    createReserva: `${baseUrl}/api/v1/reservas`,
    
    //localhost:8000/api/v1/atendentes/;id
    deleteAtendente: `${baseUrl}/api/v1/atendentes`,
    deleteReserva: `${baseUrl}/api/v1/reservas`,
    deleteCliente: `${baseUrl}/api/v1/clientes`,
    deleteHorario: `${baseUrl}/api/v1/horarios`,

    alterarAtendente: `${baseUrl}/api/v1/atendentes`,
}

export default endPoints;