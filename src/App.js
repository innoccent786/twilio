import React, {Component} from 'react';
import './App.css';

const { Device } = require('twilio-client');

class App extends Component {
  constructor(props) {
    super(props)

    this.state={
      identity: '',
      status: '',
      ready: false
    }
  }
  onChangeUpdateState=(event) =>{
    this.setState({
      identity: event.target.value
    });
  }
setup=(event)=>{

  event.preventDefault();
  fetch(`https://walkie-talkie-service-xxxx-dev.twil.io/token?identity=${this.state.identity}`)
  .then(response => response.json())
  .then(data => {
    this.state.device.setup(data.accessToken);
    this.state.device.audio.incoming(false);
    this.state.device.audio.outgoing(false);
    this.state.device.audio.disconnect(false);
  })
  .catch(err => console.log(err))
}
  componentDidMount() {
    const device = new Device();
  
    this.setState({
      device: device
    });
    
  device.on('incoming', connection => {
    // immediately accepts incoming connection
    connection.accept();

    this.setState({
      status: connection.status()
    });
  });

  device.on('ready', device => {
    this.setState({
      status: "device ready",
      ready: true
    });
  });

  device.on('connect', connection => {
    this.setState({
      status: connection.status()
    });
  });

  device.on('disconnect', connection => {
    this.setState({
      status: connection.status()
    });
  });
  }
  connect() {
    const recipient = this.state.identity === 'friend1' ? 'friend2' : 'friend1';
    this.state.device.connect({recipient: recipient});
  }
  disconnect() {
    this.state.device.disconnectAll()
  }
  render() {
    return (
      <div className="App">
        { 
          this.state.ready
          ? <button  onMouseDown={this.connect} 
          onMouseUp={this.disconnect}>
              Press to Talk
            </button> 
          : <div>
              <p>Enter your name to begin.</p>
              <form>
                <input 
                 value={this.state.identity}
                 onChange={(e)=>this.onChangeUpdateState(e)}
                  type="text" 
                  placeholder="What's your name?"></input>
                <input type="submit" value="Begin Session" onClick={(e)=>this.setup(e)}></input>
              </form>
            </div>
        }
        <p>{ this.state.status }</p>
      </div>
    );
  }
}

export default App;
