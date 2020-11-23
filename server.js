const WebSocket = require('ws');

const server = new WebSocket.Server({
    port : 8080
});

let users = [];

const IDLength = 4;

const defaultGameState = require('./client/src/schema/defaultGameState.json');

const SAVE_PATH = './games.json';

const saveGames = (gamesIn = games) => {
    require('fs').writeFileSync(SAVE_PATH,JSON.stringify(games));
}

const loadGames = () => {

    const json = require('fs').readFileSync(SAVE_PATH);

    try
    {
        return JSON.parse(json);
    }
    catch(e)
    {
        return [];
    }
}

const games = loadGames();

//console.log(games);


server.on('connection',serverSocket => {

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
        case 'create-game' :
            
            game = createGame(msg.data,sender);
            games.push(game);
            saveGames();

                
            broadcast(game,'game-created',game);
            break;

        case 'join-game' :
            game = joinGame(msg.data.gameID,
                            sender,
                            msg.data.userID,
                            );
            games[game.ID] = game;

            if(game !== null)
            {
                broadcast(game,'game-joined',{
                    game,
                    userID : msg.data.userID
                });
            }
            else
            {
                send(sender,'non-existent-game')
            }
            
            break;

    }
}

const setUserSocket = (game,userID,socket) => {
    
    console.log(game,userID,socket.send);

    games.forEach((eGame,g) => {

        eGame.users.forEach((user,i) => {

            if(user.ID === userID)
            {
                eGame.users[i].socket = socket;
            }
        });

        games[g] = eGame;
    })

    //games[game.ID] = game;

}

const joinGame = (gameID,socket,userID = null,userName = '') =>
{
    const game = findGame(gameID);

    if(game !== null)
    {
        if(userExists(game,userID))
        {
            setUserSocket(game,userID,socket);
            return game;
        }
        else
        {
            console.log('todo: create new user and join');
        }
    }

    return game;
}

const userExists = (game,userID) => game.users.find(user => user.ID === userID) !== undefined;

const findGame = ID => {

    console.log(games);

    const game = games.filter(game => game.ID === ID);

    return game.length > 0 ? game[0] : null;
}

const createGame = (hostName,hostSocket) => {
    console.log('Creating Game');

    const game = {...defaultGameState};
        game.ID = generateID(games);
        game.modified = new Date().getTime();

    const host = createUser(game,hostName,hostSocket);
    
    game.hostID = host.ID;
    game.users.push(host);

    return game;
}

const createUser = (game,name,socket) => {

    const user = {
        ID : generateID(game.users),
        name,
        socket
    }

    return user;
}

/**
 * Takes an array of items and generates a unique ID 
 * @param {Object[]} existingItems an array of objects, each with a property named ID
 * @returns String an ID string that's unique withing the context of the given array
 */
const generateID = existingItems => {

    let id = '';

    for(let i = 0; i < IDLength; i++)
    {
        let charCode = Math.round((Math.random() * 25) + 97);

        id += String.fromCharCode(charCode).toUpperCase();
    }

    return IDExists(id,existingItems) ? generateID(existingItems) : id;
}

const IDExists = (id,items) => {

    return items.find(item => item.id === id) !== undefined;
}

const send = (recipient,action,data = null) => {

    //console.log('send broke');
    
    recipient.send(JSON.stringify({
        action,
        data
    }));
}
const sanitizeGame = game => {

    const newGame = Object.assign({},game);

        newGame.users = newGame.users.map(user => {
            user.socket = undefined;
            return user;
        });

        console.log(newGame,game);

    return newGame;
}

/**
 * Broadcasts an action to all users in the given game, unless their ID is in the except array. 
 * @param {Object} game a game object containing users to broadcast to 
 * @param {Object} action the action to broadcast, contains 2 properties, type[String], data[Any]
 * @param {Any} data the data to broadcast  
 * @param {String[]} except and user IDs not to broadcast to
 */
const broadcast = (game,action,data = null,except = []) => {

    console.log('Broadcasting to',game.ID,data);

    game.users.forEach(user => {

        if(!except.includes(user.ID))
        {
            send(user.socket,action,data);
        }
    });
}