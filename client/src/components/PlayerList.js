import React from "react";

const PlayerList = ({players}) => {

    return (<ul className="PlayerList">
        {players.map(player=>{
            return (<li className="PlayerList__player" key={`player_${player.ID}`}>
                {player.name}
            </li>);
        })}
    </ul>);
}

export default PlayerList;