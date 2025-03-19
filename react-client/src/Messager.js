import { useState, useEffect } from 'react';
import './Messager.scss';
import { Author } from "./WebSocketConnector.js";

function Messager ({ webSocket }) {
    let webSocketConnector = webSocket.getInstance();

    // list of sent messages.
    const [sentMessages, setSentMessages] = useState(webSocketConnector.sentMessages);

    // User typed message that has not been sent yet.
    const [messageInput, setMessageInput] = useState('');
 
    useEffect(() => {
        webSocketConnector.subscribe(handleSentMessagesUpdate);

        // Cleanup function (similar to componentWillUnmount)
        return () => {
            webSocketConnector.unsubscribe(handleSentMessagesUpdate);
        };
      }, []);

    const handleSentMessagesUpdate = () => {
        setSentMessages(webSocketConnector.sentMessages);
    };

    const sendMessage = () => {
        webSocketConnector.sendMessage(messageInput);
        setMessageInput('');
    };
    
    const updateMessageInput = (event) => {
        setMessageInput(event.target.value);
    }

    const renderMessages = () => sentMessages.map((message) => renderMessage(message));
    
    const renderMessage = (message) => {
        const messageClass = `message ${message.author == Author.SELF ? 'self' : 'other'}`;
        return (
            <div className='message-row'> 
                <div className={messageClass}>
                    {message.text}
                </div>
            </div>
        );
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    return (
        <div className="messager">
            <div className="received-messages">
                {renderMessages()}
            </div>
            <div className="write-message">
                <input
                    value={messageInput}
                    onChange={updateMessageInput}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={sendMessage}>Send Message</button>
            </div>
        </div>
    );
}

export default Messager;