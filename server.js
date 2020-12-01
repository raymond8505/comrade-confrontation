const socketManager = require('./socket-manager');

const gameManager = require('./game-manager');

const helpers = require('./helpers');

//console.log(games);


socketManager.server.on('connection',serverSocket => {

    serverSocket.on('message',msg => {
        handleMessage(msg,serverSocket)
    });

});

const handleMessage = (msg,sender) => {
    
    msg = JSON.parse(msg);

    console.log(msg);

    let game;

    switch(msg.action)
    {
        //expects msg.data to be the a string - the name of the host user
        case 'create-game' :

            const hostID = helpers.generateID();
            game = gameManager.createGame(msg.data);
            
                
            broadcastToGame(game,'game-created',game);
            break;

        //expects msg.data to be an object {gameID,userID}
        case 'join-game' :
            game = gameManager.joinGame(msg.data.gameID,
                            sender,
                            msg.data.userID,
                            );

            if(game !== null)
            {
                broadcastToGame(game,'game-joined',{
                    game,
                    userID : msg.data.userID
                });

                updateGame(game);
            }
            else
            {
                send(sender,'non-existent-game')
            }
            
            break;
        
        //expects game.data to be an object {gameID,questions} where questions
        //is an array of question objects
        case 'set-game-rounds' :
            console.log('setting rounds for game',msg.data.gameID);

            const rounds = generateRounds(msg.data.questions);
            
            game = getGameByID(msg.data.gameID);
            
            game.rounds = rounds;

            updateGame(game);

            broadcast(game,'game-rounds-set',{
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

    const players = gameManager.getAllPlayers(game).map(p => p.ID);

    socketManager.broadcast(players,msg,data);
}