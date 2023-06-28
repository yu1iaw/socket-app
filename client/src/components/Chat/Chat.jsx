import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { io } from 'socket.io-client';

import './Chat.css';

import { InfoBar } from '../InfoBar/InfoBar';
import { Input } from '../Input/Input';
import { Messages } from '../Messages/Messages';
import { TextContainer } from '../TextContainer/TextContainer';

let socket;

export const Chat = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    const ENDPOINT = 'http://localhost:5000';

    useEffect(() => {
        const {name, room} = qs.parse(window.location.href.split('?')[1]);

        socket = io(ENDPOINT);
        // console.log(socket);
        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, (error) => {
            if (error) alert(error);
        });

        return () => {
            socket.emit("disconnect");
            socket.off();
        }
    }, [ENDPOINT])

    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message]);
        })

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(""));
        }
    }


    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} users={users}  />
            </div>
            <TextContainer users={users}/>
        </div>
    )
}