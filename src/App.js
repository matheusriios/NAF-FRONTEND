import React, { Component } from 'react';
import './App.css';

//Components
import Menu from './components/Menu'

class App extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div className="App">
        <Menu />
      </div>
    );
  }
}

export default App;
