import React, { Component } from 'react';
import './Messager.css';
import { Author, WebSocketConnector } from "./WebSocketConnector.js";

class Messager extends Component {
    constructor(props) {
        super(props);
        this.webSocketConnector = WebSocketConnector.getInstance();
        this.state = {
            sentMessages: this.webSocketConnector.sentMessages,
            messageInput: '', // To store incoming messages
        };
    }

    componentDidMount() {
        this.webSocketConnector.subscribe(this.handleSentMessagesUpdate); // Subscribe to B's changes
    }

    componentWillUnmount() {
        this.webSocketConnector.unsubscribe(this.handleSentMessagesUpdate); // Important: Unsubscribe on unmount
    }

    handleSentMessagesUpdate = () => {
        this.setState({ sentMessages: this.webSocketConnector.sentMessages }); // Update state when sent messages changes
    };
    
    sendMessage = () => {
        this.webSocketConnector.sendMessage(this.state.messageInput);
        this.setState({ messageInput: '' });
    };
    
    updateMessageInput = (messageInput) => {
        this.setState({ messageInput });
    }

    renderMessages = () => this.state.sentMessages.map((message) => this.renderMessage(message));
    
    renderMessage = (message) => {
        const messageClass = `message ${message.author == Author.SELF ? 'self' : 'other'}`;
        return (
            <div className='message-row'> 
                <div className={messageClass}>
                    {message.text}
                </div>
            </div>
        );
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
  
    render() {
        return (
            <div className="messager">
                <div className="received-messages">
                    {this.renderMessages()}
                </div>
                <div className="write-message">
                    <input 
                        value={this.state.messageInput} 
                        onChange={(event) => this.updateMessageInput(event.target.value)}
                        onKeyDown={this.handleKeyDown}
                    />
                    <button onClick={() => this.sendMessage()}>Send Message</button>
                </div>
            </div>
        );
    }
}

export default Messager;