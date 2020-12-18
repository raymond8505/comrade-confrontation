import React,{useReducer,useState,useEffect} from 'react';
import defaultGameState from '../schema/defaultGameState.json';
import {markdown} from 'markdown-js';
import readmePath from '../README.md';
import soundManager from '../soundManager';

export const GameContext = React.createContext();

const {HOST,LOCAL_STORAGE_KEY} = window.location.host.indexOf('localhost') > -1 ? require('../config.json') : require('../config-remote.json');

export const GameController = () => {

    
    const [updated,setUpdated] = useState(0);
    const [muted,setMuted] = useState(false);
    const [versionInfo,setVersionInfo] = useState(null);

    useEffect(()=>{

        fetch(readmePath).then(resp=>resp.text()).then(data=>{
            setVersionInfo(markdown(data).replace('class=','className='));
        });

    },[]);

    /**
     * The central handler for all messages coming from the server
     * @param {Object} msg 
     */
    const handleMessage = msg => {

        msg = JSON.parse(msg.data);

        console.log('handling message from server',msg);

        switch(msg.action)
        {
            case 'game-created' :

                console.log('Game Created',msg.data);

                setLocalCredentials(msg.data.game.ID,msg.data.user.ID,msg.data.user.name);

                setGameState({
                    type : ['game','user'],
                    data : [msg.data.game,msg.data.user]
                });

            break;
            
            case 'game-joined' :

                console.log('Joined Game',msg.data);

                if(msg.data.userID !== undefined)
                {
                    const user = getUserByID(msg.data.userID,msg.data.game);

                    setGameState({
                        type : ['user','game'],
                        data : [user,msg.data.game]
                    });
                }
                else
                {
                    updateGameState(msg.data.game);
                }

            break;

            case 'team-selection-request' :

                setLocalCredentials(msg.data.game.ID,msg.data.userID,msg.data.playerName);

                setGameState({
                    type : ['game','user'],
                    data : [msg.data.game,
                            getUserByID(msg.data.userID,msg.data.game)
                            ]
                });

            break;

            case 'round-started' :
            case 'round-stopped' :
                setLastBuzz(undefined);
            case 'round-stage-changed' :
            case 'round-team-chosen':
            case 'game-rounds-set' :
            case 'answers-updated' :
            case 'round-changed':
            case 'round-updated':
            case 'team-joined' :
            case 'fast-money-answers-set' :
            case 'fast-money-answer-toggled' :
            case 'teams-toggled' :
            case 'user-disconnect':
            case 'fast-money-questions-set':
            
                updateGameState(msg.data.game);

            break;

            case 'non-exsitent-game':
                clearLocalCredentials();
            break;

            case 'correct-answer' :
                //updateGameState(msg.data.game);
                playSound('correct');
            break;

            case 'answer-revealed' :
                updateGameState(msg.data.game);
                playSound('reveal');
            break;

            case 'wrong-answer' :

                if(getCurrentRound(msg.data.game) !== undefined)
                {
                    showWrongAnswerAnimation(getCurrentRoundStage(msg.data.game) <= 1 ? 1 : getCurrentRound(msg.data.game).strikes);
                }
                
                //setTimeout(()=>{
                    playSound('wrong');
                //},100)

                updateGameState(msg.data.game);

            break;

            case 'error' :
                setGameState({
                    type : 'alerts',
                    data : msg.data
                });
            break;

            case 'buzz-registered' :

                playSound('buzzer');
                
                //updateGameState(msg.data.game);
                setGameState({
                    type : ['lastBuzz','game'],
                    data : [msg.data.userID,msg.data.game]
                });
                
            break;
        }
    }

    /**
     * Wrapper for setting the current sound in state
     * @param {String} mp3 
     */
    const setCurrentSound = mp3 => {

        setGameState({
            type : 'currentSound',
            data : mp3
        });
    }

    /**
     * sets the current sound in state to undefined
     */
    const clearCurrentSound = () => {

        setCurrentSound(undefined);
    }

    /**
     * Gets the mp3 for the given slug in the soundManager and 
     * sets it in state for the SoundPlayer to use
     * @param {String} slug 
     */
    const playSound = slug => {

        const mp3 = soundManager[slug];

        console.log('MUTED',muted);
        if(mp3 !== undefined && !muted)
        {
            setCurrentSound(mp3);
        }
    }

    /**
     * Creates an alert oject to use in the alerts gameState array
     * @param {String} msg some error message to display
     * @param {String} type [default 'info'] info|error|warning|success
     */
    const createAlert = (msg,type='info') => {
        return {
            type,
            msg
        };
    }

    const updateGameState = game => {

        console.log('updating game state');

        setGameState({
            type : 'game',
            data : game
        });
    }

    /**
     * Round count starts at 1, but obviously the rounds array
     * starts at 0.
     */
    const getCurrentRound = (game=gameState.game) => game.rounds[game.currentRound];

    /**
     * Shortcut for getting the current round's stage
     * @param {Object} game 
     * @returns {Int}
     */
    const getCurrentRoundStage = (game=gameState.game) => {

        const round = getCurrentRound(game);

        return round === undefined ? undefined : round.currentStage;
    }

    /**
 * Gets all the round question's answer points. By default only collects answered question points
 * @param {Object} round a round object
 * @param {Boolean} all [default false] whether to get all questions' points or just answered ones
 * @returns {Int}
 */
const getRoundPoints = (round,all = false) => {

    let tot = 0;

    round.question.answers.forEach(answer => {

        if(all || answer.answered) tot += answer.points;
    });

    const multiplier = parseInt(round.number) !== NaN ? Number(round.number) : 1;

    return tot * multiplier ;
}

/**
 * Calls getRoundPoints, passing in the game's current round
 * @param {Object} game a game with at least one active current round
 * @param {Boolean} all [default false] whether to get all points, or just answered points
 * @returns {Int}
 */
const getCurrentRoundPoints = (all = false,game=gameState.game) => getRoundPoints(game.rounds[game.currentRound],all);
    /**
     * Updates the user field in the state object with the given user
     * @param {Object} user 
     */
    const setCurrentUser = user => {

        setGameState({
            type : 'user',
            data : user
        })
    }

    /**
     * Join a game
     * @param {String} gameID the ID of the game to join
     * @param {String} userID the ID of the user joining
     * @param {String1} userName [optional] when joining a newly created name, this is the host's name
     */
    const joinGame = (gameID,userID=null,userName=null) => {

        
        if(userID !== null || userName != null)
        {
            if(userID !== null)
            {
                
                //console.log(gameID,userID);
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
        }
    }

    /**
     * adds the given user to the given team in the given game
     * @param {Int} teamIndex 
     * @param {String} userID 
     * @param {String} gameID 
     */
    const joinTeam = (teamIndex,userID=gameState.user.ID,gameID=gameState.game.ID) => {

        sendMessage('join-team',{
            teamIndex,
            userID,
            gameID
        });
    }

    useEffect(()=>{

        const localCreds = getLocalCredentials();

        if(localCreds !== null)
        {
            joinGame(localCreds.gameID,localCreds.userID);
        }

        return ()=>{}
    },[]);

    /**
     * Send a message to the server
     * @param {String} action 
     * @param {Any} data 
     */
    const sendMessage = (action,data,curTry=0,tries=25) => {

        const msg = JSON.stringify({
            action,
            data
        });

        console.log('sending',msg);
            
        if(gameState.socket === null)
        {
            //if the socket hasn't bee set yet, keep trying
            //sendMessage(action,data);
            console.log('socket is null');
        }
        else
        {
            if(gameState.socket.readyState !== 1)
            {
                if(curTry < tries)
                {
                    setTimeout(()=>{

                        sendMessage(action,data,curTry + 1,tries);

                    },1);
                }
                else
                {
                    console.warn('server connection lost')
                }
                
            }
            else
            {
                gameState.socket.send(msg);
            }

        }
    }

    /**
     * The central state reducer. Action type is expected to be a field in the
     * gameState object
     * @param {Object} state the state object containing socket,user,game
     * @param {*} action 
     */
    const stateReducer = (state,action) => {

        //not sure why playSound doesn't respect this shit.
        if(muted && action.type === 'currentSound') return state;

        if(action.type === 'clear-all') return defaultState;
        let {type,data} = action;
        const copy = {...state};
        copy.updated = new Date().getTime();

        if(typeof type === 'string')
        {
            //console.log('changing',type,'from',state[type],'to',data);

            copy[type] = data;
        }
        else
        {
            type.forEach((t,i)=>{

                //console.log('changing',t,'from',state[t],'to',data[i]);

                copy[t] = data[i];
            });
        }

        setUpdated(updated + 1);

        return copy;
    }

    /**
     * Central connection function, creates and saves the socket to the server
     * adding all necessary event handlers
     * @param {Function} cb a callback to fire when the socket opens
     * @param {Int} tries number of times it's attempted to reconnect, it stops
     * @param {Int} maxTries number of times to try reconnecting after close
     */
    const connect = (cb,tries = 0,maxTries = 10) => {

        if(cb !== undefined)
            throw new Error('NO MORE CALLBACKS !');
        
            return;
        const newSocket = new WebSocket(HOST);
                
        newSocket.addEventListener('message',handleMessage);

        newSocket.addEventListener('open',e => {
            
            setGameState({
                type : 'socket',
                data : newSocket
            });

            cb(newSocket);
        });

        return newSocket;
    }

    const initSocket = () => {

        console.log('init socket');

        const newSocket = new WebSocket(HOST);

        newSocket.addEventListener('message',handleMessage);
        
        newSocket.addEventListener('close',()=>{
            
        });

        newSocket.addEventListener('open',e => {
            

        });

        return newSocket;
    }

    const defaultState = {
        strikesToShow : 0,
        socket : null,
        currentSound : undefined,
        lastBuzz : undefined,
        user : {ID:'',name:''},
        game : defaultGameState,
        alerts : [],
        currentFastMoneyQuestion : 0,
        currentFastMoneyPreview : 0
    };
    /**
     * The main state of the game, has 3 fields, game,user,socket
     */
    const [gameState,setGameState] = useReducer(stateReducer,
                                        defaultState
                                        );
    
    
    if(gameState.socket === null)
    {
        setGameState({
            type : 'socket',
            data : initSocket()
        });
    }

    const setCurrentFastMoneyPreview = num => {
        setGameState({
            type : 'currentFastMoneyPreview',
            data : num
        })
    }
    /**
     * animates the big strike Xs
     * @param {Int} num 
     */
    const showWrongAnswerAnimation = num => {

        setGameState({
            type : 'strikesToShow',
            data : num
        });

    }

    /**
     * Sets the state field 'lastBuzz'
     * @param {String} userID 
     */
    const setLastBuzz = userID => {

        setGameState({
            type : 'lastBuzz',
            data : userID
        })
    }

    /**
     * True if game rounds array isn't empty
     */                                        
    const gameHasRounds = gameState.game.rounds.length > 0;
    
    /**
     * Whether or not the game is currently running.
     */
    const gameIsRunning = gameState.game.ID !== '';

    /**
     * A shortcut for getting the game ID
     */
    const gameID = gameIsRunning ? gameState.game.ID : '';
    
    /**
     * Takes an array of user iDs and returns an array of user objects
     * @param {String[]} users  an array of user IDs for which to get full user info
     * @param {Object} game [default gameState] the game in which the users exist
     * @returns {Object[]}
     */
    const getUserInfo = (users,game=gameState.game) => game.users.filter(u=>users.includes(u.ID));
                            
    /**
     * Finds a user in the game b
     * @param {Object} game the game to search
     * @param {String} userID the ID of the user to return
     * @returns {Object|undefined} returns the user, or undefined if not found
     */
    const getUserByID = (userID,game=gameState.game) => game.users.find(u => u.ID === userID);

    /**
     * Sets the user's game and user ids in local storage
     * @param {*} gameID 
     * @param {*} userID 
     */
    const setLocalCredentials = (gameID,userID,name = '') => {
        
        console.log(gameState.game);

        window.localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify({
            gameID,
            userID,
            name,
        }));
    }

    /**
     * Clears the user's credentials from local storage
     */
    const clearLocalCredentials = () => {

        const creds = getLocalCredentials();
        setLocalCredentials(undefined,undefined,creds.name);
    }

    /**
     * Get's the users credentials from local storage
     * @returns {Object|null} returns the credentials object with gameID and 
     *                          userID or null if it doesnt exist
     */
    const getLocalCredentials = () => {
        const creds = window.localStorage.getItem(LOCAL_STORAGE_KEY);

        return creds === null ? null : JSON.parse(creds);
    }

    /**
     * Check if the given user is on a team in the game
     * @param {String} userID the user ID to check
     * @param {Object} game [default gameState] the game to check
     */
    const userHasTeam = (userID,game=gameState) => game.teams.map(t => t.players).flat().includes(userID);

    const currentUserHasTeam = ()=>{

        const {user,game} = gameState;

        return userHasTeam(user.ID,game);
    }
    /**
     * Whether or not the current user in state is the host of the 
     * game in state
     */
    const currentUserIsHost = ()=>{

        const {user,game} = gameState;

        return user.ID !== '' && user.ID === game.hostID; 

    }
    /**
     * Whether the user is allowed to see the game board
     */
    const userCanSeeGameBoard = ()=>{

        
        const {user,game} = gameState;

        //console.log('setting user can see game board',user,game);

        return (user.ID !== '' &&
                game.ID !== '') && (currentUserIsHost() || currentUserHasTeam())

    }

    /**
     * Creates a new game
     * @param {String} playerName name of the host
     */
    const createGame = playerName => {

        sendMessage('create-game',playerName);
    }

    /**
     * Takes a game ID and an array of questions and passes them to the server 
     * to generate the game rounds
     * @param {String} gameID 
     * @param {Object[]} questions 
     */
    const setGameRounds = (gameID,questions) => {

        //console.log(gameID,questions);
        
        sendMessage('set-game-rounds',{
            questions,
            gameID
        });
    }

    /**
     * Passed the chosen questions to the server to generate the fast money round
     * @param {String} gameID 
     * @param {Object[]} questions 
     */
    const setFastMoneyQuestions = (gameID,questions) => {
        sendMessage('set-fast-money-questions',{
            questions,
            gameID
        });
    }

    /**
     * Whether or not the current user is in the current game
     * @returns {Boolean}
     */
    const currentUserInGame = () => {
        
        const {game,user} = gameState;

        return game.users.find(u=>u.ID === user.ID) !== undefined;
    }    
    const setAlerts = alerts => {

        setGameState({
            type : 'alerts',
            data : alerts
        });
    }

    /**
     * The team with the smaller size. If equal, returns -1
     */
    const smallestTeam = ()=>{

        if(gameState.game.teams[0].length < gameState.game.teams[1].length)
        {
            return 0;
        }
        else if(gameState.game.teams[0].length > gameState.game.teams[1].length)
        {
            return 1;
        }
        else
        {
            return -1;
        }
    }

    /**
     * Starts the current round by sending the command to the server
     * @param {Object} game 
     * @param {Int} roundNum 
     */
    const startRound = (game=gameState.game,roundIndex=gameState.game.currentRound) => {

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
    const stopRound = (game=gameState.game,roundIndex=gameState.game.currentRound) => {

        sendMessage('stop-round',{
            gameID : game.ID,
            roundIndex
        });
    }

    /**
     * Sends a buzz attempt to the server
     * @param {String} gameID 
     * @param {String} userID 
     */
    const sendBuzz = (gameID,userID) => {

        const teamIndex = getUserTeamIndex(userID);

        sendMessage('register-buzz',{gameID,userID,teamIndex});
    }

    /**
     * Gets the team index of the given user. Returns undefined if user doesn't have a team
     * @param {String} userID 
     * @returns {Int|undefined}
     */
    const getUserTeamIndex = (userID=gameState.user.ID,
                                game=gameState.game) => 
    {

        let teamIndex = undefined;

        game.teams.forEach((t,i) => {

            if(t.players.includes(userID))
            {
                teamIndex = i;
                return;
            }
        });

        return teamIndex;
    }

    /**
     * Sends a wrong answer message to the server
     */
    const registerStrike = () => {

        sendMessage('wrong-answer',{gameID:gameState.game.ID});
    }

    const clearStrikesToShow = () => {
        setGameState({
            type : 'strikesToShow',
            data : 0
        });
    }

    

    /**
     * Sends a correct-answer message to the server along with the answer that was correct.
     * @param {Int} answerIndex 
     */
    const sendCorrectAnswer = answerIndex => {

        const gameID = gameState.game.ID;
        
        sendMessage('correct-answer',{
            gameID,
            answerIndex
        });
    }

    /**
     * Choose which team will play the current round
     * @param {Int} i 
     */
    const chooseTeamForRound = i => {

        sendMessage('choose-current-round-team',{
            gameID : gameState.game.ID,
            teamIndex : i
        });
    }

    /**
     * Resets the whole game state
     */
    const clearGameState = () => {
        setGameState({
            type : 'clear-all'
        });
    }

    /**
     * Loops over the game rounds and returns the question object of each round if it exists
     * @param {Object} game a game object with rounds and questions 
     * @returns {Object[]} an array of questions
     */
    const getGameQuestions = (game=gameState.game) => game.rounds.filter(r=>r.question !== undefined).map(r=>r.question);
    
    /**
     * Tells the server to advance to the next round
     */
    const gotoNextRound = () => {

        sendMessage('next-round',{gameID : gameState.game.ID});
    }

    const setFastMoneyAnswers = (gameID,answers,playerIndex) => {

        sendMessage('set-fast-money-answers',{
            gameID,
            answers,
            playerIndex
        });
    }

    const toggleFastMoneyAnswer = (answerIndex,playerIndex) => 
    {
        sendMessage('toggle-fast-money-answer',{
            gameID : gameState.game.ID,
            answerIndex,
            playerIndex
        });
    }

    const replaceQuestion = i => {

        sendMessage('replace-question',{
            gameID,
            round : i,
            host : window.location.host
        });
    }
    /**
     * Tell the server to toggle the active team. Used by the host to fix user errors.
     */
    const toggleTeams = () => {

        if(gameIsRunning)
        {
            sendMessage('toggle-teams',{
                gameID : gameState.game.ID
            });
        }
    }

    const revealAnswer = (gameID,roundIndex,answerIndex) => {

        sendMessage('reveal-answer',{
            gameID,
            roundIndex,
            answerIndex
        });
    }

    /**
     * format's the location.search into a key=val pair object
     * @returns {Object}
     */
    const getURLParams = () => {
        const urlParamsStrs = window.location.search.replace(/^\?/,'').split('&');
        const urlParams = {};

        urlParamsStrs.forEach(str => {
            
            const param = str.split('=');

            urlParams[param[0]] = param[1];
        })

        return urlParams;
    }
    /**
     * A number of things need to be in a certain state for the current user to be able to buzz
     */
    const currentUserCanBuzz = getCurrentRound() !== undefined &&
                                getCurrentRound().currentStage === 0 &&
                                getCurrentRound().started && 
                                gameState.game.activeTeam == -1 && 
                                !currentUserIsHost() &&
                                currentUserHasTeam();
    return {
        gameState,
        gameIsRunning,
        setLocalCredentials,
        getLocalCredentials,
        clearLocalCredentials,
        userCanSeeGameBoard,
        createGame,
        joinGame,
        currentUserHasTeam,
        currentUserIsHost,
        currentUserInGame,
        currentUserCanBuzz,
        getCurrentRound,
        getCurrentRoundStage,
        getUserInfo,
        setGameRounds,
        setFastMoneyQuestions,
        gameHasRounds,
        updated,
        createAlert,
        setAlerts,
        smallestTeam,
        joinTeam,
        startRound,
        stopRound,
        sendBuzz,
        getUserTeamIndex,
        playSound,
        clearCurrentSound,
        registerStrike,
        clearStrikesToShow,
        sendCorrectAnswer,
        chooseTeamForRound,
        clearGameState,
        gotoNextRound,
        getGameQuestions,
        setCurrentFastMoneyPreview,
        setFastMoneyAnswers,
        toggleFastMoneyAnswer,
        toggleTeams,
        replaceQuestion,
        getURLParams,
        muted,
        setMuted,
        getCurrentRoundPoints,
        revealAnswer,
        versionInfo
    };
}