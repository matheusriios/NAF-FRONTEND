import React, { Component } from 'react';
import './App.css';

//Components
import Login from './components/Login'


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
    var formData = new FormData();
    formData.append('grant_type', 'password')
    formData.append('client_id', '1')
    formData.append('client_secret', 'KREUhtWzcoPp8W4lXKl1esjuyqn3JettR5TLY5UX')
    formData.append('username', 'gerente@outlook.com')
    formData.append('password', 'secret')
    formData.append('scope', '' )
      
    const resp = await fetch('http://localhost:8000/oauth/token', {
      method: 'POST',
      body: formData,
      headers: {
        // 'Content-Type': 'application',
        // 'Accept': 'application/json',        
      }
    });
    const data = await resp.json()
    console.log(data)
  }

  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

export default App;
