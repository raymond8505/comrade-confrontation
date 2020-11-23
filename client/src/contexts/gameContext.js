import React,{useReducer, useState} from 'react';
import defaultGameState from '../schema/defaultGameState.json';

export const GameContext = React.createContext();

const HOST = 'ws://135.23.208.111:8080';

const LOCAL_STORAGE_KEY = 'cc-creds';



export const GameController = () => {

    let socket;

    const [currentUser,setCurrentUser] = useState(null);

    const gameStateReducer = (state,action) => {
        
        console.log(state,action);
        switch(action.type)
        {
            case 'connect' :
                state.socket = action.data;
                break;
            case 'create-game' :
                return action.data; //replace the entire game state with the new game data
            default :
                break;
        }

        return state;
    }

    const connect = (cb) => {
        
        socket = new WebSocket(HOST);
        
        socket.addEventListener('message',handleMessage);

        socket.addEventListener('open',e => {
            
            setGameState({
                type : 'connect',
                data : socket
            });

            cb(socket);
        });

        
    }

    const handleMessage = msg => {

        msg = JSON.parse(msg.data);

        switch(msg.action)
        {
            case 'game-created' :
                console.log('Game Created',msg.data);

                setLocalCredentials(msg.data.ID,msg.data.hostID);

                setGameState({
                    type : 'create-game',
                    data : msg.data
                });

                setCurrentUser(msg.data.hostID);

                break;

            case 'game-joined' :
                console.log('Joined Game',msg.data);

                setCurrentUser(msg.data.userID);

                setGameState({
                    type : 'create-game',
                    data : msg.data.game
                });

                break;

            case 'game-join-failed' :
                console.log(`Can't join game`,msg.data);
                break;
        }
    }

    const sendMessage = (action,data) => {

        const {socket} = gameState;

        const msg = JSON.stringify({
            action,
            data
        });

        setTimeout(()=>{

            if(socket.readyState === 1)
            {
                socket.send(msg);
            }
            else
            {
                sendMessage(action,data);
            }
        },5);
    }

    const createGame = playerName => {

        connect(socket => {

            sendMessage('create-game',playerName);
        });
    }

    const joinGame = (gameID,userID=null,userName=null) => {

        if(userID !== null || userName != null)
        {
            connect(socket => {
            
                if(userID !== null)
                {
                    //join as an existing user
                    sendMessage('join-game',{
                        gameID,
                        userID 
                    });
                }
                else
                {
                    //join as a new user
                    sendMessage('join-game',{
                        gameID,
                        userName 
                    });
                }
            });
        }
        
    }
    
    const [gameState,setGameState] = useReducer(gameStateReducer,defaultGameState);

    const gameIsRunning = gameState.ID !== '';

    const setLocalCredentials = (gameID,userID) => {

        window.localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify({
            gameID,
            userID
        }));
    }

    const clearLocalCredentials = () => {

        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    const getLocalCredentials = () => {
        const creds = window.localStorage.getItem(LOCAL_STORAGE_KEY);

        return creds === null ? null : JSON.parse(creds);
    }

    return {
        gameState,
        setGameState,
        gameIsRunning,
        createGame,
        joinGame,
        setLocalCredentials,
        getLocalCredentials,
        currentUser
    };

    
}
