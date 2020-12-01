const updateGame = game => {

    game.modified = new Date().getTime();
    
    games[getGameIndex(game)] = game;
    
    saveGames(games);
}

const IDLength = 4;

const getGameIndex = game => games.findIndex(g=>g.ID === game.ID);

const getGameByID = id => {
    const gs = games.filter(g => g.ID === id);

    return gs.length === 0 ? null : gs[0];
}

const generateRounds = questions => {

    const rounds = [];

    questions.forEach((q,i) => {

        const round = {...roundSchema};
            round.number = i + 1;
            round.question = q;

        rounds.push(round);
    })

    return rounds;
}

const defaultGameState = require('./client/src/schema/defaultGameState.json');

const roundSchema = require('./client/src/schema/rounds.json');

const SAVE_PATH = './games.json';

const saveGames = (gamesIn = games) => {

    let cop = [...games];

    require('fs').writeFileSync(SAVE_PATH,JSON.stringify(cop));
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

const findGame = ID => {

    const game = games.filter(game => game.ID === ID);

    return game.length > 0 ? game[0] : null;
}

const createGame = (hostName,hostSocket) => {
    console.log('Creating Game');

    const game = {...defaultGameState};
        game.ID = generateID(games);
        game.modified = new Date().getTime();

    const host = createUser(game,hostName,hostSocket);
    
    addGameSocket(game.ID,host.ID,hostSocket);

    console.log('game sockets',getGameSockets(game.ID));

    game.hostID = host.ID;
    game.users.push(host);

    return game;
}

const userExists = (game,userID) => getAllPlayers(game).includes(p => p.ID === userID);

const getAllPlayers = game => {

    return game.teams.flatMap(team => team.players);
}

const createUser = (game,name) => {

    //get all users in the game and return an array of their IDs for use with
    //generateID
    const user = {
        ID : generateID(getAllPlayers(game).map((socket)=>socket.userID)),
        name
    }

    return user;
}

const joinGame = (gameID,socket,userID,userName = '') =>
{
    const game = findGame(gameID);

    if(game !== null)
    {
        if(userExists(game,userID))
        {
            console.log(userID,'exists');
            
            return game;
        }
        else
        {
            console.log('todo: create new user and join');
        }
    }

    return game;
}

module.exports = {
    updateGame,
    getGameByID,
    getGameIndex,
    generateRounds,
    games,
    findGame,
    createGame,
    joinGame,
    getAllPlayers
}