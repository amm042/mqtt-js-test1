import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var mqtt = require('mqtt');
var client = mqtt.connect("ws://amm042:9001/")
class Messages extends Component{
  render(){

    var messageList = this.props.m.map((message, index) => {
                    return <li key={index}>{message}</li>;
                  });

    return  <ul>{ messageList }</ul>

  }
}
class Say extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {message: ""}
  }
  handleChange(e){
    this.setState({message: e.target.value})
  }

  handleSubmit(e){
    e.preventDefault();
    console.log('saying: '+this.state.message)

    this.props.onSend(this.state.message)
  }
  render(){
    return <form onSubmit={this.handleSubmit}>
      <label>Say what</label>
      <input type="text" onChange={this.handleChange}/>
      <input type="submit" value="Say it"/>
    </form>
  }
}
class App extends Component {
  constructor(props){
    super(props);
    this.state = {messages:[]};
  }
  componentWillMount(){
    client.on('connect', ()=>{
      client.publish('announce', 'client joined!')
      // sub after pub so we don't get our own announcement
      client.subscribe('announce');
    });
    client.on('message', (topic,message)=>{
      console.log('Incoming message: ' + message.toString());
      this.setState((prevState, props)=> {
        return {messages:prevState.messages.concat(
          topic.toString()+': '+message.toString())}
        })
      });
  }
  componentWillUnmount(){
    client.end();
  }
  sender(msg){
    console.log("MQTT sending: "+msg.toString())
    client.publish('announce', msg.toString())
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Messages m={this.state.messages}/>
        <Say onSend={this.sender}/>
      </div>
    );
  }
}

export default App;
