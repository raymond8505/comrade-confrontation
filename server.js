const socketManager = require('./socket-manager');

const gameManager = require('./game-manager');

const helpers = require('./helpers');

//const { createUser, getGameByID, userExists } = require('./game-manager');
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
        

    }
}

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