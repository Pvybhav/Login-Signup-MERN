import React, { Component } from 'react';
import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counters: [],
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: ''
    };
    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(this);
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);

    // this.newCounter = this.newCounter.bind(this);
    // this.incrementCounter = this.incrementCounter.bind(this);
    // this.decrementCounter = this.decrementCounter.bind(this);
    // this.deleteCounter = this.deleteCounter.bind(this);

    // this._modifyCounter = this._modifyCounter.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if(obj && obj.token) {
      //verify token
      console.log(obj)
      fetch('/api/account/verify?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          console.log("json in componentDidMount()", json);
          if(json.success) {
            this.setState({
              token: obj.token, 
              isLoading: false
            });
          }
          else{
            this.setState({
              isLoading: false
            });
          }
        });
    }
    else{
      this.setState({
        isLoading: false,
      })
    }

  }
  onTextBoxChangeSignInEmail(event){
    this.setState({
      signInEmail: event.target.value
    })
  }
  onTextBoxChangeSignInPassword(event){
    this.setState({
      signInPassword: event.target.value
    })
  }
  onTextBoxChangeSignUpEmail(event){
    this.setState({
      signUpEmail: event.target.value
    })
  }
  onTextBoxChangeSignUpPassword(event){
    this.setState({
      signUpPassword: event.target.value
    })
  }
  onTextBoxChangeSignUpFirstName(event){
    this.setState({
      signUpFirstName: event.target.value
    })
  }
  onTextBoxChangeSignUpLastName(event){
    this.setState({
      signUpLastName: event.target.value
    })
  }
  onSignUp(){

    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    fetch('/api/account/signup', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName :signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    }).then(res => res.json())
      .then(json => {
        console.log(json)
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
          })
        }
        else{
          this.setState({
            signUpError: json.message,
            isLoading: false
          })
        }
      });
  }
  onSignIn(){
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    })
    fetch('/api/account/signin', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })})
      .then(res => res.json())
      .then(json => {
        if(json.success){
          setInStorage('the_main_app', { token: json.token})
          this.setState({
            signInError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            token: json.token,
          })
        }
        else{
          this.setState({
            signInError: json.message,
            isLoading: false
          })
        }
      });
  }
  logout(){
    this.setState({
      isLoading: true,
    })

    const obj = getFromStorage('the_main_app');
    if(obj && obj.token) {
      //verify token
      fetch('/api/account/logout?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if(json.success) {
            this.setState({
              token : '', 
              isLoading: false
            });
          }
          else{
            this.setState({
              isLoading: false
            });
          }
        });
    }
    else{
      this.setState({
        isLoading: false,
      })
    }
  }
  // newCounter() {
  //   fetch('/api/counters', { method: 'POST' })
  //     .then(res => res.json())
  //     .then(json => {
  //       let data = this.state.counters;
  //       data.push(json);

  //       this.setState({
  //         counters: data
  //       });
  //     });
  // }

  // incrementCounter(index) {
  //   const id = this.state.counters[index]._id;

  //   fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
  //     .then(res => res.json())
  //     .then(json => {
  //       this._modifyCounter(index, json);
  //     });
  // }

  // decrementCounter(index) {
  //   const id = this.state.counters[index]._id;

  //   fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
  //     .then(res => res.json())
  //     .then(json => {
  //       this._modifyCounter(index, json);
  //     });
  // }

  // deleteCounter(index) {
  //   const id = this.state.counters[index]._id;

  //   fetch(`/api/counters/${id}`, { method: 'DELETE' })
  //     .then(_ => {
  //       this._modifyCounter(index, null);
  //     });
  // }

  // _modifyCounter(index, data) {
  //   let prevData = this.state.counters;

  //   if (data) {
  //     prevData[index] = data;
  //   } else {
  //     prevData.splice(index, 1);
  //   }

  //   this.setState({
  //     counters: prevData
  //   });
  // }

  render() {
    
    const {
      isLoading,
      token,
      signInError,
      signUpError,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword 
    } = this.state;

    if(isLoading){
      return (<div><p>Loading.....</p></div>);
    }
    if(!token){
      return(
        <div>
          <div>
            {
              (signInError)? (
                <p>{signInError}</p>
              ): null
            }
            <p> Sign In</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail}
              onChange={this.onTextBoxChangeSignInEmail}              
            />
            <br/>
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword}
              onChange={this.onTextBoxChangeSignInPassword}              
            />
            <br/>
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br/>
          <br/>
          <br/>
          <div>
          {
              (signUpError)? (
                <p>{signUpError}</p>
              ): null
            }
            <p> Sign Up</p>
            <input 
              type="text" 
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextBoxChangeSignUpFirstName}              
            />
            <br/>
            <input 
              type="text" 
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextBoxChangeSignUpLastName}
              />
            <br/>
            <input 
              type="email" 
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextBoxChangeSignUpEmail}              
            />
            <br/>
            <input 
              type="password" 
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextBoxChangeSignUpPassword}
            />
            <br/>
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      )
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}>logout</button>
      </div>
    );
  }
}

export default Home;

{/* <p>Counters:</p>

        <ul>
          { this.state.counters.map((counter, i) => (
            <li key={i}>
              <span>{counter.count} </span>
              <button onClick={() => this.incrementCounter(i)}>+</button>
              <button onClick={() => this.decrementCounter(i)}>-</button>
              <button onClick={() => this.deleteCounter(i)}>x</button>
            </li>
          )) }
        </ul>

        <button onClick={this.newCounter}>New counter</button> */}
      // </>