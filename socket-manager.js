const WebSocket = require('ws');

const server = new WebSocket.Server({
    port : 8080
});

//each key is a game code
const sockets = [];

const approvedProtocols = ['localhost','ff.raymondselzer.net'];

const auth = socket => approvedProtocols.includes(socket.protocol);

const addSocket = (ID,socket) => {
    
    if(socketExists(ID))
    {
        console.log('updating socket for',ID);
        sockets.filter(u=>u.ID === ID)[0].socket = socket;
    }
    else
    {
        console.log('adding socket for',ID);
        sockets.push({
            ID,
            socket
        });
    }
}

const removeSocket = userID => {

    const userIndex = sockets.findIndex(u=>u.ID === userID);

    if(userIndex > -1)
    {
        sockets.splice(userIndex,1);
    }
}

const socketExists = id => sockets.filter(s=>s.ID === id).length > 0;

/**
 * Sends some data with an action slug to the given web socket
 * @param {WebSocket} recipient 
 * @param {String} action 
 * @param {Any} data 
 */
const send = (recipient,action,data = null) => {

    //console.log(recipient);
    
    recipient.send(JSON.stringify({
        action,
        data,
    }));
}

/**
 * Broadcasts an action to all users in the given game, unless their ID is in the except array. 
 * @param {String[]} userIDs an array of user ids to
 * @param {Object} action the action to broadcast, contains 2 properties, type[String], data[Any]
 * @param {Any} data the data to broadcast  
 * @param {String[]} except and user IDs not to broadcast to
 */
const broadcast = (userIDs,action,data = null,except = []) => {

    const sockets = getSockets(userIDs.filter(id => !except.includes(id)));

    sockets.forEach(s => {

        if(s.readyState === 1)
        {
            send(s,action,data);
        }
    });
}

/**
 * Takes a socket and returns the first associated ID it finds
 * @param {WebSocket} socket the socket of the user to find
 * @returns {String|undefined} the user ID or undefined if nothing found
 */
const getUserID = socket => {

    const matches = sockets.filter(s=>s.socket == socket);

    return matches.length > 0 ? matches[0].ID : undefined;
}
/**
 * Gets an array of socket objects for the given user ids
 * @param {String[]} ids an array of user IDs
 * @returns {WebSocket[]} an array of corresponding web sockets for the given users
 */
const getSockets = ids => sockets
                            .filter(us => ids.includes(us.ID))
                            .map(u => u.socket);

module.exports = {
    broadcast,
    send,
    sockets,
    server,
    addSocket,
    getUserID,
    removeSocket,
    auth
};