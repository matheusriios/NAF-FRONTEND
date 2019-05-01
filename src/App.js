import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {

    }
  }

  componentDidMount() {
    this.reqApi()
  }

  reqApi = async () => {
    const objBody = {
      grant_type: 'password',
      client_id: '1',
      client_secret: 'KREUhtWzcoPp8W4lXKl1esjuyqn3JettR5TLY5UX',
      username: 'gerente@outlook.com',
      password: 'secret',      
      scope: ''
    }
     
    const resp = await fetch('http://localhost:8000/oauth/token', {      
      method: 'POST',
      body: objBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',        
      }
    });

    console.log(resp)
  }

  render() {
    return (
      <div className="App">
       
      </div>
    );
  }
}

export default App;
