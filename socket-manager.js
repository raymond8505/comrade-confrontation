const WebSocket = require('ws');

const server = new WebSocket.Server({
    port : 8080
});

//each key is a game code
const sockets = [];

const addSocket = (ID,socket) => {
    
    if(socketExists(ID))
    {
        sockets.filter(u=>u.ID === ID).socket = socket;
    }
    else
    {
        sockets.push({
            ID,
            socket
        });
    }
}

const socketExists = id => sockets.includes(id);

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
    addSocket
};