const socketManager = require('./socket-manager');

const gameManager = require('./game-manager');

const helpers = require('./helpers');

//const { createUser, getGameByID, userExists } = require('./game-manager');
const { generateID } = require('./helpers');
const { updateGame, getGameByID, games } = require('./game-manager');

//console.log(games);


socketManager.server.on('connection',serverSocket => {

    console.log('new connection');

    serverSocket.on('message',msg => {
        handleMessage(msg,serverSocket)
    });

});

const handleMessage = (msg,sender) => {
    
    msg = JSON.parse(msg);

    console.log('handling message',msg);

    let game;

    switch(msg.action)
    {
        //expects msg.data to be the a string - the name of the host user
        case 'create-game' :

            const host = gameManager.createUser(helpers.generateID(),msg.data.name);

            game = gameManager.createGame();

            gameManager.addHost(game,host);
            socketManager.addSocket(host.ID,sender);
            
            broadcastToGame(game,'game-created',{
                game,
                user : host
            });
            break;

        //expects msg.data to be an object {gameID,userID}
        case 'join-game' :

            //user is sending a playerName instead of a userID
            //this mean's they're not associated with a game
            //yet
            //this can definitely be refactored
            if(msg.data.userID === undefined)
            {
                game = gameManager.getGameByID(msg.data.gameID);

                if(game === null)
                {
                    socketManager.send(sender,'error',
                        [{
                            msg : `No game exists with code "${msg.data.gameID}"`,
                            type : 'error'}
                        ]);
                }
                else
                {
                    const userObj = gameManager.createUser(generateID(game.users),msg.data.userName);

                    socketManager.addSocket(userObj.ID,sender);

                    const suggestedTeam = gameManager.suggestTeam(game);

                    if(!gameManager.userExists(game,userObj.ID))
                    {
                        gameManager.addUser(game,userObj);
                    }

                    socketManager.send(sender,'team-selection-request',{
                        userID : userObj.ID,
                        game,
                        suggestedTeam
                    });
                }
                
            }
            else
            {
                const {userID} = msg.data;
                 
                game = gameManager.joinGame(msg.data.gameID,
                                sender,
                                msg.data.userID,
                                );

                socketManager.addSocket(msg.data.userID,sender);

                if(game !== null)
                {
                    broadcastToGame(game,'game-joined',{
                        game
                        
                    },[userID]);

                    socketManager.broadcast([userID],'game-joined',{
                        game,
                        userID
                    });

                    gameManager.updateGame(game);
                }
                else
                {
                    socketManager.send(sender,'non-existent-game')
                }
            }
                
            break;
        
        //expects game.data to be an object {gameID,questions} where questions
        //is an array of question objects
        case 'set-game-rounds' :
            console.log('setting rounds for game',msg.data.gameID);

            const rounds = gameManager.generateRounds(msg.data.questions);
            
            game = gameManager.getGameByID(msg.data.gameID);
            
            game.rounds = rounds;
            game.currentRound = 0;

            gameManager.updateGame(game);

            broadcastToGame(game,'game-rounds-set',{
                game
            });
            break;
        //expects msg.data to be a string, userID
        case 'reconnect' :
            console.log('todo: reconnect logic');
            break;
        case 'join-team' :
            const {teamIndex,userID,gameID} = msg.data;

            game = gameManager.getGameByID(gameID);

            //console.log('joining team',game.users.includes(String(u=>u.ID) == String(userID)));//,game,userID);

            if(gameManager.userExists(game,userID))
            {
                console.log('user exists, broadcasting');
                gameManager.addUserToTeam(game,userID,teamIndex);

                
                broadcastToGame(game,'team-joined',{game});
            }

            break;
        case 'start-round' :
        case 'stop-round' :

            game = gameManager.getGameByID(msg.data.gameID);
            const {roundIndex} = msg.data;

            if(game !== undefined && game.rounds[roundIndex] !== undefined)
            {
                
                game.rounds[game.currentRound - 1].started = msg.action === 'start-round';
                game.rounds[game.currentRound - 1].currentStage = 0;

                game.activeTeam = -1;

                console.log(game.rounds[game.currentRound - 1]);

                if(msg.action === 'start-round')
                {
                    
                }

                gameManager.updateGame(game);

                const resp = msg.action === 'start-round' ? 'round-started' : 'round-stopped';

                broadcastToGame(game,resp,{
                    game,
                    roundIndex
                })
            }
            break;
        case 'register-buzz' :

            game = gameManager.getGameByID(msg.data.gameID);

            if(game.activeTeam === -1)
            {
                game.activeTeam = msg.data.teamIndex;
                
                updateGame(game);

                broadcastToGame(game,'buzz-registered',{game,userID : msg.data.userID});
            }

            break;

        case 'correct-answer' :

            console.log('question',msg.data.answerIndex,' marked correct');
            
            game = gameManager.getGameByID(msg.data.gameID);

            const index = msg.data.answerIndex;
            const {currentStage,answerToBeat} = game.rounds[game.currentRound - 1];

            console.log('current stage is',currentStage);

            game.rounds[game.currentRound - 1].question.answers[index].answered = true;

            //switch-ception seems like a code smell. maybe definitely refactor.
            switch(currentStage)
            {
                //0,1 are head 2 head, similar logic applies, 
                case 0:
                case 1:

                    //winner correctly guessed an answer that WASNT #1
                    //so move to stage 1 and switch the active team
                    if(index > answerToBeat)
                    {
                        console.log('answer was ',index,', answer to beat was',answerToBeat,'flipping activeTeam and moving to stage 1');
                        game.rounds[game.currentRound - 1].currentStage = 1;
                        game.rounds[game.currentRound - 1].answerToBeat = index;

                        //switch the active team to steal
                        game.activeTeam = game.activeTeam == 0 ? 1 : 0;
                    }
                    //winner guessed the #1 answer, so move straight to stage 2
                    //but activeTeam remains the same
                    else
                    {
                        console.log('answer was',index,', beating',answerToBeat,'- moving to stage 2');
                        game.rounds[game.currentRound - 1].currentStage = 2;
                        game.activeTeam = -1;
                    }

                    updateGame(game);
                    broadcastToGame(game,'round-stage-changed',{game});

                    break;
                case 2:
                    
                    //the question is marked answered above, so now we just need to figure out if
                    //the round was won or not
                    
                    //if the question still has unanswered questions
                    const questionsRemaining = game.rounds[game.currentRound - 1].question.answers.filter(a=>!a.answered);

                    if(questionsRemaining.length > 0)
                    {
                        console.log('question still has answers');
                        updateGame(game);
                        broadcastToGame(game,'answers-updated',{game});

                        //we're only breaking if there's still questions to answer
                        //otherwise we continue to score tally and round progression
                        break;
                    }
                    
                case 3:
                        if(currentStage === 2)
                        {
                            console.log('all questions answered');
                        }
                        else
                        {
                            console.log('successful steal');
                        }

                        console.log('assigning round points to active team');

                        //assign points of all answered questions to the active team
                        //in case 2 the active team is one who took the round after H2H
                        //in case 3 the active team is the opposite team, attempting to steal
                        game.teams[game.activeTeam].score += getCurrentRoundPoints(game);

                        if(game.currentRound == game.rounds.length)
                        {
                            console.log('last round comeplete, game over.');
                        }
                        else
                        {
                            advanceRound(game);
                            updateGame(game);
                            broadcastToGame(game,'round-changed',{game});
                        }
            }

            break;

            case 'choose-current-round-team' : 

                game = getGameByID(msg.data.gameID);
                console.log('host has chosen the team to play the current round. Setting activeTeam to',msg.data.teamIndex);
                game.activeTeam = msg.data.teamIndex;
                updateGame(game);

                broadcastToGame(game,'round-team-chosen',{game});

            break;

            

    }
}

const advanceRound = game => {

    game.rounds[game.currentRound - 1].started = false;
    game.activeTeam = -1;
    game.currentRound++;
    game.currentStage = 4;
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

    return tot;
}

/**
 * Calls getRoundPoints, passing in the game's current round
 * @param {Object} game a game with at least one active current round
 * @param {Boolean} all [default false] whether to get all points, or just answered points
 * @returns {Int}
 */
const getCurrentRoundPoints = (game,all = false) => getRoundPoints(game.rounds[game.currentRound - 1],all);
/**
 * Takes a game, message and data and sends it out to all 
 * the players in the given game
 * @param {Object} game 
 * @param {String} msg 
 * @param {Any} data 
 */
const broadcastToGame = (game,msg,data,except = []) => {

    const users = game.users.map(p => p.ID);

    socketManager.broadcast(users,msg,data,except);
}