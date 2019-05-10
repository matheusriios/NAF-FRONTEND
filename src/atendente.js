import baseUrl from './service';

const reserva = () => {
    
    
    const loadTodosAtendentes = async () => {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjA0N2ViMmM4MjNlZmRlMGJmMTU3MzRhY2QyMjI2NGIxMDIwYTUwNjliOWQyOGZjMGE5MWJlNWRiNTRiOWRkYmUwZmUxOTQ0NzU0YWRjYzQzIn0.eyJhdWQiOiIxIiwianRpIjoiMDQ3ZWIyYzgyM2VmZGUwYmYxNTczNGFjZDIyMjY0YjEwMjBhNTA2OWI5ZDI4ZmMwYTkxYmU1ZGI1NGI5ZGRiZTBmZTE5NDQ3NTRhZGNjNDMiLCJpYXQiOjE1NTc0NTQ3NjUsIm5iZiI6MTU1NzQ1NDc2NSwiZXhwIjoxNTU3NDU4MzY1LCJzdWIiOiI1Iiwic2NvcGVzIjpbXX0.hxxtPeD0rE8btSVXaidxXYSW7cMok3R4ecihqOIV2lTDgQXedH2X6xzuY3uf0lXOyXSjeCkhafDtcFqqzK4dzSZYDbZT5dfyK0ZSC6ckOe27Cm_i4WAJxBOlchy-jjVISGrYLPa67ffPPdkLgZyczmDbWZvuIQb8yVjblpiuypEI0ZEaf8LVO6OjxkqiZd-2z3TroG7_kmuVRolEP_4WBd2c7LCHjRg1c0XDckfnb7Gt9pCTN6xWhEEzGOxCW3Wn4nJPjh_Edx3NadJuNloomsOyB1arq_FaybjMZ2qagww-AjZiQ0D7f-ceTOXnw6VewDE-iZd8q90D-v5q3pQ0HG6czyJ73SF_tNKDHLzOnEcZjG2xCmemtYsZ3nZY4O11N5C_UeGr_9xxufAkBWppARAxl9NmeWixZyxnb5Hxp_4k4xPlgDercQuWrq6oXPLLuyS3B1FopWI73CEBoDcSKdLIaEzWiSANshoWMNNolud6irkOnC8kmytcLiX1jRLepcmEkkrO5jTZYsjzJYl6t4kww-JL8RK46FezP9KDntCaztVXpAhLXheElZm8Fd9ExJXiNMTfb77x5sf0Uo3hYQm7tp9bHnqn04w9LdKdoyyrHJyIKHSAWhGUvS7S42RIsbfo7ruEo_zbaL9JAmluExpvV0zJ5YBrTtqLvGZdAYA'
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
        const bodyListaAtendentes = document.getElementById('body-lista-atendentes')
        let todosAtendentes = await loadTodosAtendentes()
        
        todosAtendentes.map(antendente => {
            bodyListaAtendentes.innerHTML += `
                <tr>
                    <td>${antendente.user.name}</td>
                    <td>${antendente.user.email}</td>
                    <td>${antendente.celular}</td>
                    <td>${antendente.perfil}</td>
                    <td><button type="button" class="btn btn-secondary">Reservas</button></td>                    
                </tr>  
            `
        })
        

    }


    return {        
        listaAtendentes
    }    
}

export default reserva

