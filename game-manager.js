const helpers = require('./helpers');
const cloneDeep = require('lodash/cloneDeep');
const config = require('./server-config.json');
/**
 * Updates a game's modified time and optionally saves the games array to file
 * @param {Object} game a game object to update
 * @param {Boolean} andSave  [default true] whether to save immediately after update
 */
const updateGame = (game,andSave=true) => {

    game.modified = new Date().getTime();
    
    games[getGameIndex(game)] = game;
    
    if(andSave)
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

        const round = cloneDeep({...roundSchema},true);
            round.number = i + 1;
            round.question = q;

        rounds.push(round);
    })

    return rounds;
}



const defaultGameState = require('./client/src/schema/defaultGameState.json');

const roundSchema = require('./client/src/schema/rounds.json');
const { sockets } = require('./socket-manager');

const SAVE_PATH = './games.json';

const saveGames = (gamesIn = games) => {

    //console.log('saving games disabled');
    require('fs').writeFileSync(SAVE_PATH,JSON.stringify(gamesIn));
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

let games = loadGames();

const findGame = ID => {
    
    const game = games.filter(game => game.ID === ID);

    return game.length > 0 ? game[0] : null;
}

/**
 * Instantiates a blank game, pushes it to the games array and saves the games
 */
const createGame = () => {
    console.log('Creating Game');

        const game = cloneDeep(require('./client/src/schema/defaultGameState.json'),true);

        console.log(game.teams);

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

/**
 * Checks if the given user exists in the given game
 * @param {Object} game 
 * @param {String} userID 
 * @returns {Boolean}
 */
const userExists = (game,userID) => game.users.filter(p => p.ID === userID).length > 0;

/**
 * Gets all the players of both teams (so everyone but the host)
 * @param {Object} game 
 */
const getAllPlayers = game => {

    return game.teams.flatMap(team => team.players);
}

/**
 * auto suggest joining the team with fewer players
 * default team 1 if same num players
 * @param {Object} game a game object to check
 * @returns {Int} (1|0) the index of the team to suggest  
 */
const suggestTeam = game => game.teams[0].players.length <= game.teams[1].players.length ? 0 : 1;

const joinGame = (gameID,socket,userID,userName = '') =>
{
    const game = findGame(gameID);

    if(game !== null)
    {
        if(userExists(game,userID))
        {
            //console.log(userID,'exists','in',gameID);
            
            return game;
        }
        else
        {
            console.log('todo: create new user and join');
        }
    }

    return game;
}

const addUserToTeam = (game,userID,teamIndex) => {

    game.teams[teamIndex].players.push(userID);

    saveGames();
}

const getRandomQuestion = (src = 'real-qeustions.json') => {

    const questions = require(`./client/src/data/${src}`);

    console.log(helpers);

    return questions[helpers.between(0,questions.length - 1)];
}

/**
 * Removes a player from a game
 * @param {Object} game a game to remove the player from 
 * @param {String} userID id of the user to remove
 */
const removePlayer = (game,userID) => {
    game.teams.forEach(team => {

        const playerIndex = team.players.indexOf(userID);

        if(playerIndex > -1)
        {
            team.players.splice(playerIndex,1);
        }
    });
}

/**
 * Takes a user ID and returns the first game it finds containing that user
 * @param {*} userID a user ID to search for
 * @returns {Object|undefined} the matching game or undefined if no matches
 */
const getUserGame = userID => {

    return games.find(game=>{
        return game.users.findIndex(u => u.ID === userID) > -1;
    })
}
/**
 * Takes a user ID and removes the player from any teams in any games they might be in
 * @param {String} userID 
 */
const removePlayerEverywhere = userID => {

    games.forEach(game => {

        removePlayer(game,userID);

        updateGame(game,false);
    });

    saveGames();
}

const pruneGames = (olderThan = config.GAME_MANAGER.GAME_EXPIRY) =>
{


    const expiry = new Date().getTime() - olderThan;
    const expiredGames = games.filter(game => {
        return game.modified < expiry;
    });

    const prevNum = games.length;

    games = games.filter(g=>g.modified > expiry);

    console.log('Pruning',games.length - prevNum,'games');
    saveGames();
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
    addUserToTeam,
    createUser,
    addHost,
    suggestTeam,
    userExists,
    roundSchema,
    getRandomQuestion,
    removePlayer,
    getUserGame,
    pruneGames
}