import React, { Component } from 'react';
import './menu.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default class Menu extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return(
            <div>
                <Navbar className="container-nav-bar">
                    <div className="container">
                        <Navbar.Brand href="#home">
                            <span className="name-gerente">Olá, Gerente</span>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="">
                                {/* <Nav.Link href="#home">Cadastrar Cliente/Atendente</Nav.Link> */}
                                <Nav.Link href="#link">Atendentes</Nav.Link>
                                <NavDropdown title="Cadastrar" id="basic-nav-dropdown">                                
                                    <NavDropdown.Item href="#action/3.2">Clientes</NavDropdown.Item>                            
                                    <NavDropdown.Item href="#action/3.3">Serviço</NavDropdown.Item>                            
                                    <NavDropdown.Item href="#action/3.3">Reserva</NavDropdown.Item>                            
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>
            </div>
        )
    }
}