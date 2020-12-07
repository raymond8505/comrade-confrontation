import React,{useReducer, useState} from 'react';
import defaultGameState from '../schema/defaultGameState.json';
import allQuestions from '../data/sample-questions.json';
import soundManager from '../soundManager';

export const GameContext = React.createContext();

const HOST = require('../config.json').HOST;

const LOCAL_STORAGE_KEY = 'cc-creds';

let socket;

export const GameController = () => {

    /**
     * an object representing the current user.
     */
    const [currentUser,setCurrentUser] = useState(null);

    const [alerts,setAlerts] = useState([]);

    const [suggestedTeam,setSuggestedTeam] = useState(0);

    const [lastBuzz,setLastBuzz] = useState(undefined);

    const [currentSound,setCurrentSound] = useState(undefined);

    const [showPassOrPlay,setShowPassOrPlay] = useState(false);

    const createAlert = (msg,type='info') => {
        return {
            type,
            msg
        };
    }

    const gameStateReducer = (state,action) => {
        
        switch(action.type)
        {
            case 'connect' :
               socket = action.data;
                
                break;
            
            //these actions just need to update the game in state because
            //the server did the work.
            case 'game-rounds-set' :
            case 'create-game' :
            case 'update' :
                return action.data;
            default :
                break;
        }

        return state;
    }

    /**
     * Sometimes the server gives us a whole new game state and we 
     * just need to override our local game state with it.
     * @param {Object} newGame a new game object
     */
    const updateGameState = newGame => setGameState({
        type : 'update',
        data : newGame
    });

    const [gameState,setGameState] = useReducer(gameStateReducer,defaultGameState);

    const [showTeamPicker,setShowTeamPicker] = useState(false);

    const [userCanSeeGameBoard,setUserCanSeeGameBoard] = useState(false);

    const gameIsRunning = !gameState || gameState.ID !== '';

    const connect = (cb,tries = 0) => {
        
        const newSocket = new WebSocket(HOST);
                
        newSocket.addEventListener('message',handleMessage);

        newSocket.addEventListener('open',e => {
            
            setGameState({
                type : 'connect',
                data : socket
            });

            cb(newSocket);
        });

        newSocket.addEventListener('close',()=>{
            
            //console.log('socket close');
            
            /*sendMessage('reconnect',{
                userID : currentUser.ID,
                gameID : gameState.ID
            });*/
        });

        socket = newSocket;
    }

    /**
     * Checks if the given user is the host of the current game
     * @param {Object} user
     * @returns {Boolean}
     */
    const userIsHost = user => gameState.hostID === user.ID;

    const currentUserIsHost = () => userIsHost(currentUser);
    
    /**
     * Checks if the current user is on a team in the given game
     * @param {Object} game 
     * @returns {Boolean}
     */
    const currentUserHasTeam = (game=gameState) => {
        
        //console.log(currentUser.ID,game);
        return userHasTeam(currentUser.ID,game);
    }
    
    /**
     * Check if the given user is on a team in the game
     * @param {String} userID the user ID to check
     * @param {Object} game [default gameState] the game to check
     */
    const userHasTeam = (userID,game=gameState) => game.teams.map(t => t.players).flat().includes(userID);

    const getUserTeamIndex = userID => {

        let teamIndex = undefined;

        gameState.teams.forEach((t,i) => {

            if(t.players.includes(userID))
            {
                teamIndex = i;
                return;
            }
        });

        return teamIndex;
    }

    const getUserTeam = userID => {

        const i = getUserTeamIndex(userID);

        return i === undefined ? undefined : gameState.teams[i];
    }
    const _userCanSeeGameBoard = ()=>{

        console.log(gameState);

        if(currentUser === undefined || currentUser === null)
        {
            //console.log(currentUser,'isnt set');
            return false;
        }
        if(currentUserIsHost())
        {
            //console.log('user is host');
            return gameState.ID !== '';
        }
        else
        {
            //console.log(currentUserHasTeam());
            return currentUserHasTeam();
            
        }

    };

    
    /**
     * Round count starts at 1, but obviously the rounds array
     * starts at 0.
     */
    const getCurrentRound = (game=gameState) => gameState.rounds[game.currentRound - 1];

    const handleMessage = msg => {

        msg = JSON.parse(msg.data);

        console.log('handling message from server',msg);
        switch(msg.action)
        {
            case 'game-created' :
                console.log('Game Created',msg.data);

                setLocalCredentials(msg.data.game.ID,msg.data.user.ID);

                setGameState({
                    type : 'create-game',
                    data : msg.data.game
                });

                setCurrentUser(msg.data.user);
                setUserCanSeeGameBoard(true);

                break;

            case 'game-joined' :
                console.log('Joined Game',msg.data);

                if(msg.data.userID != undefined)
                {
                    const user = getUserByID(msg.data.userID,msg.data.game);

                    setCurrentUser(user);
                }
                

                updateGameState(msg.data.game);

                setUserCanSeeGameBoard(true);

                break;

            case 'game-join-failed' :
                //console.log(`Can't join game`,msg.data);
                break;

            case 'non-existent-game' :

                setAlerts([
                    createAlert(
                        'No game exists with that code. Please double check your spelling, or host your own game.','error')
                ]);
                break;
            case 'team-selection-request' :
                setLocalCredentials(msg.data.game.ID,msg.data.userID);
                updateGameState(msg.data.game);
                setShowTeamPicker(true);
                setCurrentUser(getUserByID(msg.data.userID,msg.data.game));
                setSuggestedTeam(msg.data.suggestedTeam);

                break;
            case 'team-joined' :
                //console.log('team joined');

                updateGameState(msg.data.game);
                setUserCanSeeGameBoard(true);

                break;
            case 'round-started' :
            case 'round-stopped' :
                setLastBuzz(undefined);

                setImmediate(()=>{
                    console.log('reloading to avoid state sync issue, probably fix this in the future');
                    window.location.reload(); //this is icky. There's some sort of state sync issue
                });

            case 'buzz-registered' :
                

                if(msg.action === 'buzz-registerd')
                {
                    setLastBuzz(msg.data.userID);
                }
                
                console.log(msg.action,msg.data.game);

                if(msg.action === 'buzz-registered')
                    playSound('buzzer');
                
                updateGameState(msg.data.game);
                
                break;
            
            case 'round-stage-changed' :
            case 'round-team-chosen':
            case 'game-rounds-set' :
            case 'answers-updated' :
            case 'round-changed':

                updateGameState(msg.data.game);
        }
    }

    const getRoundStage = (round,game=gameState) => {
        return game.rounds[game.currentRound - 1].currentStage;
    }

    const getCurrentRoundStage = (game=gameState) => {

        return getCurrentRound(game).currentStage;
    }
    /**
     * Finds a user in the game b
     * @param {Object} game the game to search
     * @param {String} userID the ID of the user to return
     * @returns {Object|undefined} returns the user, or undefined if not found
     */
    const getUserByID = (userID,game=gameState) => game.users.find(u => u.ID === userID);

    /**
     * Send a message to the server
     * @param {String} action 
     * @param {Any} data 
     */
    const sendMessage = (action,data) => {

        const msg = JSON.stringify({
            action,
            data
        });

        setTimeout(()=>{
            
            if(socket === null)
            {
                //if the socket hasn't bee set yet, keep trying
                sendMessage(action,data);
                //console.log('retrying');
            }
            else
            {
                if(socket.readyState === 1)
                {
                    socket.send(msg);
                }
                else
                {
                    sendMessage(action,data);
                }
            }
            
        },5);
    }

    const createGame = playerName => {

        connect(socket => {

            sendMessage('create-game',playerName);
        });
    }

    const joinTeam = (teamIndex,userID=currentUser.ID,gameID=gameState.ID) => {

        sendMessage('join-team',{
            teamIndex,
            userID,
            gameID
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

    /**
     * Takes an array of user iDs and returns an array of user objects
     * @param {String[]} users  an array of user IDs for which to get full user info
     * @param {Object} game [default gameState] the game in which the users exist
     * @returns {Object[]}
     */
    const getUserInfo = (users,game=gameState) => game.users.filter(u=>users.includes(u.ID));

    /**
     * Starts the current round by sending the command to the server
     * @param {Object} game 
     * @param {Int} roundNum 
     */
    const startRound = (game=gameState,roundIndex=gameState.currentRound - 1) => {

        sendMessage('start-round',{
            gameID : game.ID,
            roundIndex
        });
    }
    
    /**
     * Starts the current round by sending the command to the server
     * @param {Object} game 
     * @param {Int} roundNum 
     */
    const stopRound = (game=gameState,roundIndex=gameState.currentRound - 1) => {

        sendMessage('stop-round',{
            gameID : game.ID,
            roundIndex
        });
    }

    const sendBuzz = (gameID,userID) => {

        const teamIndex = getUserTeamIndex(userID);

        sendMessage('register-buzz',{gameID,userID,teamIndex});
    }
    
    const playSound = slug => {

        const mp3 = soundManager[slug];

        if(mp3 !== undefined)
        {
            setCurrentSound(mp3);
        }
    }

    const sendCorrectAnswer = answerIndex => {

        const gameID = gameState.ID;
        
        sendMessage('correct-answer',{
            gameID,
            answerIndex
        });
    }

    const chooseTeamForRound = i => {

        sendMessage('choose-current-round-team',{
            gameID : gameState.ID,
            teamIndex : i
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
        clearLocalCredentials,
        currentUser,
        allQuestions,
        getQuestionByID,
        setGameRounds,
        getCurrentRound,
        getCurrentRoundStage,
        userIsHost,
        currentUserIsHost,
        currentUserHasTeam,
        alerts,
        setAlerts,
        createAlert,
        showTeamPicker,
        suggestedTeam,
        joinTeam,
        userCanSeeGameBoard,
        getUserInfo,
        startRound,
        stopRound,
        sendBuzz,
        lastBuzz,
        getUserTeamIndex,
        getUserTeam,
        currentSound,
        setCurrentSound,
        playSound,
        sendCorrectAnswer,
        showPassOrPlay,
        chooseTeamForRound
    };
}