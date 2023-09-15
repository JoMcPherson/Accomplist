// import React, { useState, useEffect, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import Message from "./Message";

// export const socket = io(`${process.env.REACT_APP_API_HOST}`, {
//     path: '/ws/socket.io/',
//     autoConnect: true
//     }
//     );

// export default function Chat({user}){

//     const [isConnected, setIsConnected] = useState(socket.connected);
//     const [messagesList, setMessagesList] = useState([]);
//     const [message, setMessage] = useState('');

//         // socket.emit('namepass', {'username': user.username, 'photo': user.photo})
//     const effectivePassing = useCallback(function namepassing({user}) {
//          socket.emit('namepass', {'username': user.username, 'photo': user.photo})
//             },[]
//             );

//     // const chatSocketFunction = useCallback(function useEffectLogic() {
//     //      socket.on('connect', () => {
//     //         setIsConnected(socket.connected);
//     //     });

//     //     socket.on('disconnect', () => {
//     //         setIsConnected(socket.connected);
//     //     });


//     //     socket.on('join', (data) => {
//     //         setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'join'}])
//     //         // socket.emit('namepass', {'username': user.username, 'photo': user.photo});
//     //     });

//     //     socket.on('chat', (data) => {
//     //         setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'chat'}]);
//     //     });

//     //     socket.on('namepass', (data) => {
//     //         setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'namepass'}]);
//     //     });
//     // }, []);


//         useEffect(() => {
//             effectivePassing({user})
//         }, [user, user.id, effectivePassing])

//         // useEffect(() => {
//         //     chatSocketFunction()
//         // }, [chatSocketFunction])

//         useEffect(() => {

//         // const socket = io(`${process.env.REACT_APP_API_HOST}`, {
//         // path: '/ws/socket.io'
//         // }
//         // );


//         socket.on('connect', () => {
//             setIsConnected(socket.connected);
//         });

//         socket.on('disconnect', () => {
//             setIsConnected(socket.connected);
//         });

//         socket.on('join', (data) => {
//             setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'join'}])
//             // socket.emit('namepass', {'username': user.username, 'photo': user.photo});
//         });

//         socket.on('chat', (data) => {
//             setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'chat'}]);
//         });

//         socket.on('namepass', (data) => {
//             setMessagesList((prevMessages) => [...prevMessages, {...data, type: 'namepass'}]);
//         });
//         }, [])


// return (
// <>
//     <h2 className='socket-chat-header1'>
//         status: { isConnected ? 'connected':'disconnected'}
//     </h2>
//     <div className='chatApp__conv'>
//     <div className='chatApp__convTimeline'>
//         {messagesList.map((message, messageID) => (
//             <Message message={message} key={messageID} user={user}/>
//         )
//         )}
//     </div>
//     </div>
//     <div className='socket-chat-send-container'>
//         <input className='chatApp__convInput'
//         type={'text'}
//         id='message'
//         onChange={(event) => {
//             const value = event.target.value.trim();
//             setMessage(value)
//         }}>
//         </input>
//         <button className='chatApp__convButton ' onClick={() => {
//             if (message && message.length) {
//                 socket.emit('chat', message);
//             }
//             var messageBox = document.getElementById('message')
//             messageBox.value = '';
//             setMessage('')
//         }}>Send</button>
//     </div>
// </>
//     )
// };
