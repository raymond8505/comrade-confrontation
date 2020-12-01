import React,{useReducer, useState} from 'react';
import defaultGameState from '../schema/defaultGameState.json';
import allQuestions from '../data/sample-questions.json';

export const GameContext = React.createContext();

const HOST = require('../config.json').HOST;

const LOCAL_STORAGE_KEY = 'cc-creds';

export const GameController = () => {

    let socket;

    const [currentUser,setCurrentUser] = useState(null);

    const gameStateReducer = (state,action) => {
        
        switch(action.type)
        {
            case 'connect' :
                state.socket = action.data;
                break;
            
            //these actions just need to update the game in state because the server
            //did the work.
            case 'game-rounds-set' :
            case 'create-game' :
                
                console.log(action);
                state = updateGame(state,action.data);

            default :
                break;
        }

        return state;
    }

    /**
     * updates the game state with a server provided replacement, but maintains the socket.
     * @param {Object} game 
     * @returns {Object} a copy of the new game, but with the socket field maintained
     */
    const updateGame = (oldGame,newGame) => {

        newGame.socket = oldGame.socket;

        return newGame;
    }

    const connect = (cb,tries = 0) => {
        
        socket = new WebSocket(HOST);
        
        socket.addEventListener('message',handleMessage);

        socket.addEventListener('open',e => {
            
            setGameState({
                type : 'connect',
                data : socket
            });

            cb(socket);
        });

        socket.addEventListener('close',()=>{
            
            console.log('socket close');
            
            /*sendMessage('reconnect',{
                userID : currentUser.ID,
                gameID : gameState.ID
            });*/
        });
    }

    const handleMessage = msg => {

        msg = JSON.parse(msg.data);

        switch(msg.action)
        {
            case 'game-created' :
                console.log('Game Created',msg.data);

                // setLocalCredentials(msg.data.ID,msg.data.hostID);

                // setGameState({
                //     type : 'create-game',
                //     data : msg.data
                // });

                // setCurrentUser(msg.data.hostID);

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
            case 'game-rounds-set' :
                setGameState({
                    type : 'game-rounds-set',
                    data : msg.data.game
                });
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
                connect(()=>{
                    sendMessage(action,data);
                })
                
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

    const getQuestionByID = id => {

        const matches = allQuestions.filter(q=>q.ID === id);

        return matches.length > 0 ? matches[0] : null;
    }

    const setGameRounds = (gameID,questions) => {

        sendMessage('set-game-rounds',{
            questions,
            gameID
        });
    }

    return {
        gameState,
        setGameState,
        gameIsRunning,
        createGame,
        joinGame,
        setLocalCredentials,
        getLocalCredentials,
        currentUser,
        allQuestions,
        getQuestionByID,
        setGameRounds
    };

    
}
