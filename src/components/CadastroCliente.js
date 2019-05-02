import React, {Component} from 'react';
import './cadastro-cliente.css'
export default class CadastroCliente extends Component {
    constructor(props) {
        super(props)

        this.state = {
            celular: '',
            whatsapp: '',
            telefoneFixo: '',
            nome: '',
            email: '',
            senha: '',            
        }
    }

    captureCelular = (event) => {
        this.setState({
            celular: event.target.value
        })
    }
    
    captureWhatsapp = (event) => {
        this.setState({
            whatsapp: event.target.value
        })
    }

    captureTelefoneFixo = (event) => {
        this.setState({
            telefoneFixo: event.target.value
        })
    }

    captureNome = (event) => {
        this.setState({
            nome: event.target.value
        })
    }

    captureEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    captureSenha = (event) => {
        this.setState({
            senha: event.target.value
        })
    }

    btnCadastrar = async () => {
        const {celular, whatsapp, telefoneFixo, nome, email, senha} = this.state

        let formData = new FormData()
        formData.append('celular',  `${celular}`)
        formData.append('whatsapp', `${whatsapp}`)
        formData.append('telefone', `${telefoneFixo}`)
        formData.append('name',     `${nome}`)
        formData.append('email',    `${email}`)
        formData.append('password', `${senha}`)

        const resp = await fetch('http://localhost:8000/api/v1/clientes', {
            method: 'POST',
            body: formData
        })

        console.log(resp)

    }

    render(){
        return( 
            <div className="container-page-cadastro-cliente">
                <div className="container-form">
                    <h1>Register</h1>
                    <form className="form">
                        <div className="form-group">
                            <label className="label">Celular</label>
                            <input className="input-cadastro" onChange={this.captureCelular}></input> 
                        </div>
                        <div className="form-group">
                            <label className="label">Whatsapp</label>
                            <input className="input-cadastro" onChange={this.captureWhatsapp}></input>
                        </div>
                        <div className="form-group">
                            <label className="label">Telefone Fixo</label>
                            <input className="input-cadastro" onChange={this.captureTelefoneFixo}></input>
                        </div>
                        <div className="form-group">
                            <label className="label">Nome *</label>
                            <input className="input-cadastro" onChange={this.captureNome}></input>
                        </div>
                        <div className="form-group">
                            <label className="label">Email *</label>
                            <input className="input-cadastro" onChange={this.captureEmail}></input>
                        </div>
                        <div className="form-group">
                            <label className="label">Senha *</label>
                            <input className="input-cadastro" type="password" onChange={this.captureSenha}></input>                        
                        </div>
                        <div className="form-group container-button">
                            <div className="button-send" onClick={this.btnCadastrar}>
                                <span>Cadastrar</span>
                            </div>
                        </div>
                    </form>
                </div>                
            </div>
        )
    }
}