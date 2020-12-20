import React,{useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const PlayerList = ({players}) => {

    const {gameState} = useContext(GameContext);

    const currentUser = gameState.user;

    console.log(gameState);

    return (<ul className="PlayerList">
        {players.map(player=>{
            return (<li 
                className={`PlayerList__player
                ${currentUser.ID === player.ID ? ' PlayerList__player--current' : ''}
                ${player.ID === gameState.lastBuzz ? ' PlayerList__player--buzzed' : ''}`} key={`player_${player.ID}`}>
                {player.name}
            </li>);
        })}
    </ul>);
}

export default PlayerList;