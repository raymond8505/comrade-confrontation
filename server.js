const socketManager = require('./socket-manager');

const gameManager = require('./game-manager');

const helpers = require('./helpers');
const { send } = require('./socket-manager');
const { createUser, getGameByID } = require('./game-manager');
const { generateID } = require('./helpers');

//console.log(games);


socketManager.server.on('connection',serverSocket => {

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
            
            broadcastToGame(game,'game-created',game);
            break;

        //expects msg.data to be an object {gameID,userID}
        case 'join-game' :

            //user is sending a playerName instead of a userID
            //this mean's they're not associated with a game
            //yet
            if(msg.data.userID === undefined)
            {
                game = getGameByID(msg.data.gameID);

                const userObj = createUser(generateID(game.users),msg.data.userName);

                socketManager.addSocket(userObj.ID,sender);

                const suggestedTeam = gameManager.suggestTeam(game);

                socketManager.send(sender,'team-selection-request',{
                    userID : userObj.ID,
                    game,
                    suggestedTeam
                });
            }
            else
            {
                game = gameManager.joinGame(msg.data.gameID,
                                sender,
                                msg.data.userID,
                                );

                socketManager.addSocket(msg.data.userID,sender);

                if(game !== null)
                {
                    broadcastToGame(game,'game-joined',{
                        game,
                        userID : msg.data.userID
                    });

                    gameManager.updateGame(game);
                }
                else
                {
                    send(sender,'non-existent-game')
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
            game.currentRound = 1;

            gameManager.updateGame(game);

            broadcastToGame(game,'game-rounds-set',{
                game
            });
            break;
        //expects msg.data to be a string, userID
        case 'reconnect' :
            console.log('todo: reconnect logic');
            break;

    }
}

/**
 * Takes a game, message and data and sends it out to all 
 * the players in the given game
 * @param {Object} game 
 * @param {String} msg 
 * @param {Any} data 
 */
const broadcastToGame = (game,msg,data) => {

    const users = game.users.map(p => p.ID);

    socketManager.broadcast(users,msg,data);
}