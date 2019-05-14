const baseUrl = 'http://localhost:8000';

const endPoints = {
    listarAtendentes: `${baseUrl}/api/v1/atendentes`,
    authUsuario: `${baseUrl}/oauth/token`,
    usuarioAutenticado: `${baseUrl}/api/v1/auth/me`,
    //localhost:8000/api/v1/atendentes/;id
    getAtendente: `${baseUrl}/api/v1/atendentes`,
    createAtendente: `${baseUrl}/api/v1/atendentes`,
    getReservas: `${baseUrl}/api/v1/reservas`,
}

export default endPoints;