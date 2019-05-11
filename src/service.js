const baseUrl = 'http://localhost:8000';

const endPoints = {
    listarAtendentes: `${baseUrl}/api/v1/atendentes`,
    authUsuario: `${baseUrl}/oauth/token`,
    usuarioAutenticado: `${baseUrl}/api/v1/auth/me`,
    //localhost:8000/api/v1/atendentes/;id
    getAtendente: `${baseUrl}/api/v1/atendentes`
}

export default endPoints;