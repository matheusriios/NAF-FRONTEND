import React, { Component } from 'react';
import './App.css';

//Components
import CadastroCliente from './components/CadastroCliente'

class App extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <CadastroCliente />
      </div>
    );
  }
}

export default App;
