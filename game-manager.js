const helpers = require('./helpers');

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

    //console.log('saving games disabled');
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

/**
 * Instantiates a blank game, pushes it to the games array and saves the games
 */
const createGame = () => {
    console.log('Creating Game');

    const game = {...defaultGameState};
        game.ID = helpers.generateID(games);
        game.modified = new Date().getTime();

    games.push(game);
    saveGames();

    return game;
}
const createUser = (id,name = '') => {
    return {
        ID : id,
        name
    };
}
/**
 * Adds a user to a game
 * @param {Object} game 
 * @param {Object} user 
 */
const addUser = (game,user) => {

    game.users.push(user);

    saveGames();
}

/**
 * Adds a user to a game, then sets that user as the game's host
 * @param {Object} game 
 * @param {Object} user 
 */
const addHost = (game,user) => {

    addUser(game,user);

    game.hostID = user.ID;

    saveGames();
}
const userExists = (game,userID) => game.users.includes(p => p.ID === userID);

/**
 * Gets all the players of both teams (so everyone but the host)
 * @param {Object} game 
 */
const getAllPlayers = game => {

    return game.teams.flatMap(team => team.players);
}

const joinGame = (gameID,socket,userID,userName = '') =>
{
    const game = findGame(gameID); 

    if(game !== null)
    {
        if(userExists(game,userID))
        {
            console.log(userID,'exists','in',gameID);
            
            return game;
        }
        else
        {
            console.log(game.users,userID);
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
    getAllPlayers,
    addUser,
    createUser,
    addHost
}