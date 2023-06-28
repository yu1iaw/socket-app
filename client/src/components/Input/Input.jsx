import React from 'react';

import './Input.css';

export const Input = ({message, setMessage, sendMessage, users}) => {
    return (
        <form className='form'>
            <input 
                type="text"
                className='input'
                placeholder='Type a message...'
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage(e) : null} />
            <button disabled={!users.length} className='sendButton' onClick={(e) => sendMessage(e)}>Send</button>
        </form>
    )
}