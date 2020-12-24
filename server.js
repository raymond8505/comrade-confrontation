const socketManager = require('./socket-manager');

const gameManager = require('./game-manager');

const helpers = require('./helpers');

//const { createUser, getGameByID, userExists } = require('./game-manager');
const { generateID } = require('./helpers');
const { updateGame, getGameByID, games, generateRounds } = require('./game-manager');
const { cloneDeep, update } = require('lodash');

//console.log(games);


socketManager.server.on('connection',serverSocket => {

    if(!socketManager.auth(serverSocket))
    {
        console.log('not auth');
        serverSocket.close();
        return;
    }

    serverSocket.on('message',msg => {
        handleMessage(msg,serverSocket);
    });

    serverSocket.on('close',(code,reason)=>{
        
        const userID = socketManager.getUserID(serverSocket);

        socketManager.removeSocket(userID);

        const game = gameManager.getUserGame(userID);

        if(game != undefined)
        {
            gameManager.removePlayer(
                game,
                userID);

            broadcastToGame(game,'user-disconnect',{
                game
            });
        }
        
        
    })

});

const nextRound = game => {

    advanceRound(game);
    updateGame(game);
    broadcastToGame(game,'round-changed',{game});
}

/**
 * 
 * @param {Object} msg 
 * @param {WebSocket} sender 
 */
const handleMessage = (msg,sender) => {
    
    msg = JSON.parse(msg);

    console.log('handling message',msg);

    let game,round;

    switch(msg.action)
    {
        //expects msg.data to be the a string - the name of the host user
        case 'create-game' :

            gameManager.pruneGames();

            const host = gameManager.createUser(helpers.generateID(),msg.data);

            console.log(host);

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

            game = gameManager.getGameByID(msg.data.gameID);

            if(game === null)
            {
                socketManager.send(sender,'non-exsitent-game',{
                    gameID : msg.data.gameID
                })
            }

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
                        suggestedTeam,
                        playerName : userObj.name
                    });
                }
                
            }
            else
            {
                const {userID} = msg.data;
                 
                game = gameManager.joinGame(msg.data.gameID,
                                sender,
                                msg.data.userID
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
                socketManager.send(sender,'play-theme',{});
            }

            break;
        case 'start-round' :
        case 'stop-round' :

            game = gameManager.getGameByID(msg.data.gameID);
            const {roundIndex} = msg.data;

            if(game !== undefined && game.rounds[roundIndex] !== undefined)
            {
                
                game.rounds[game.currentRound].started = msg.action === 'start-round';
                
                if(game.currentRound < 3)
                {
                    game.rounds[game.currentRound].currentStage = 0;
                    game.activeTeam = -1;
                }

                //console.log(game.rounds[game.currentRound]);

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

                console.log(msg.data.userID);

                broadcastToGame(game,'buzz-registered',{game,
                                                        userID : msg.data.userID});
            }

            break;
        case 'wrong-answer' :

            game = getGameByID(msg.data.gameID);
            round = game.rounds[game.currentRound];


            switch(round.currentStage)
            {
                //team that won H2H answers wrong, swap the activeTeam and push the stage to 1
                //continue switching active team til someone answers right.
                case 0 :
                    game.activeTeam = game.activeTeam == 0 ? 1 : 0;
                    round.currentStage = 1;
                    break;
                case 1 :
                    
                    game.activeTeam = -1;
                    round.currentStage = 2;
                    
                    break;

                //the active team is attempting to answer all the round's questions    
                case 2:
                    
                    round.strikes++;
                    //third strike! Switch teams and move to stage 3- "the stealin stage" as the kids are calling it
                    
                    if(round.strikes === 3)
                    {
                        round.currentStage = 3;
                        game.activeTeam = game.activeTeam == 0 ? 1 : 0;
                    }

                    break;
                //steal failed! Award points to original team, move to stage 4- the post round answer reading stage
                case 3:
                    game.activeTeam = game.activeTeam == 0 ? 1 : 0;
                    round.currentStage = 4;

                    game.teams[game.activeTeam].score += getCurrentRoundPoints(game);
                break;
            }

            updateGame(game);
            broadcastToGame(game,'wrong-answer',{game});

        break;
        
        case 'next-round':

            game = getGameByID(msg.data.gameID);

            if(game.currentRound < 2)
            {
                nextRound(game);
            }
            else
            {
                console.log('fast money!'); 
                nextRound(game);
            }
        break;

        case 'correct-answer' :

            game = gameManager.getGameByID(msg.data.gameID);

            broadcastToGame(game,'correct-answer',{});
            
            //console.log(game);

            const index = msg.data.answerIndex;
            const {currentStage,answerToBeat} = game.rounds[game.currentRound];

            //console.log('current stage is',currentStage);

            game.rounds[game.currentRound].question.answers[index].answered = true;

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
                        
                        game.rounds[game.currentRound].answerToBeat = index;

                        if(game.rounds[game.currentRound].currentStage == 0)
                        {
                            game.activeTeam = game.activeTeam == 0 ? 1 : 0;
                        }
                        else
                        {
                            game.activeTeam = -1;
                        }

                        game.rounds[game.currentRound].currentStage += 1;
                        //switch the active team to steal
                    }
                    //winner guessed the #1 answer, so move straight to stage 2
                    //but activeTeam remains the same
                    else
                    {
                        console.log('answer was',index,', beating',answerToBeat,'- moving to stage 2');
                        game.rounds[game.currentRound].currentStage = 2;
                        game.activeTeam = -1;
                    }

                    updateGame(game);
                    broadcastToGame(game,'round-stage-changed',{game});

                    break;
                case 2:
                    
                    //the question is marked answered above, so now we just need to figure out if
                    //the round was won or not
                    
                    //if the question still has unanswered questions
                    const questionsRemaining = game.rounds[game.currentRound].question.answers.filter(a=>!a.answered);

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
                            game.rounds[game.currentRound].currentStage = 4;
                            updateGame(game);
                            broadcastToGame(game,'round-stage-changed',{game});
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

        case 'set-fast-money-questions' :
            game = getGameByID(msg.data.gameID);

            round = cloneDeep(require('./client/src/schema/fastMoneyRound.json'));

            round.questions = msg.data.questions;
            
            game.rounds[3] = round;
            game.currentRound = 3;
            game.activeTeam = game.teams[0].score >= game.teams[1].score ? 0 : 1;
            
            updateGame(game);

            broadcastToGame(game,'fast-money-questions-set',{
                game
            });
            
        break;
            
        case 'set-fast-money-answers':
            game = getGameByID(msg.data.gameID);
            round = game.rounds[3];
            const {playerIndex,answers} = msg.data;

            round.currentStage = playerIndex + 1;
            round.playerAnswers[playerIndex] = answers;
            round.started = false;

            updateGame(game);

            console.log(round);
            broadcastToGame(game,'fast-money-answers-set',{game});
        break;

        case 'toggle-fast-money-answer' :
            game = getGameByID(msg.data.gameID);
            round = game.rounds[3];

            if(round.playerAnswers[msg.data.playerIndex].length > 0)
            {
                round.playerAnswers[msg.data.playerIndex][msg.data.answerIndex].revealed =
                    !round.playerAnswers[msg.data.playerIndex][msg.data.answerIndex].revealed;

                updateGame(game);
                broadcastToGame(game,'fast-money-answer-toggled',{game});
            }
        break;
            
        case 'toggle-teams':

            game = getGameByID(msg.data.gameID);
            game.activeTeam = game.activeTeam == 0 ? 1 : 0;

            updateGame(game);
            broadcastToGame(game,'teams-toggled',{
                game
            });

        break;
        case 'replace-question':

            game = getGameByID(msg.data.gameID);

            const newRound = cloneDeep(gameManager.roundSchema,true);
            const oldRound = game.rounds[msg.data.round];
            
            newRound.number = oldRound.number;
            newRound.question = gameManager.getRandomQuestion(msg.data.host.indexOf('localhost') > -1 ? 'sample-questions.json' : 'real-questions.json',oldRound.question.answers.length);
            game.rounds[msg.data.round] = newRound;

            updateGame(game);
            broadcastToGame(game,'round-updated',{
                game
            });

            break;

        case 'reveal-answer' :
            game = getGameByID(msg.data.gameID);

            if(game !== null)
            {
                game.rounds[msg.data.roundIndex].question.answers[msg.data.answerIndex].revealed = true;
    
                updateGame(game);
                broadcastToGame(game,'answer-revealed',{game});
            }

        break;

        case 'set-game-settings':
            game = getGameByID(msg.data.gameID);

            game.fastMoneyStakes = msg.data.stakes;
            game.teams[0].name = msg.data.team1;
            game.teams[1].name = msg.data.team2;
            game.rounds = generateRounds(msg.data.questions);

            updateGame(game);
            broadcastToGame(game,'game-settings-set',{game});

    }
}

const advanceRound = game => {

    game.rounds[game.currentRound].started = false;
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

    const multiplier = parseInt(round.number) !== NaN ? Number(round.number) : 1;

    return tot * multiplier ;
}

/**
 * Calls getRoundPoints, passing in the game's current round
 * @param {Object} game a game with at least one active current round
 * @param {Boolean} all [default false] whether to get all points, or just answered points
 * @returns {Int}
 */
const getCurrentRoundPoints = (game,all = false) => getRoundPoints(game.rounds[game.currentRound],all);
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