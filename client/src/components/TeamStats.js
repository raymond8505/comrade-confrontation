import React,{useContext} from "react";
import {GameContext} from '../contexts/gameContext';
import StatusDot from "./StatusDot";

const TeamStats = ({team,enableDot = false}) => {

    return (<div className="TeamStats">
        <div className="TeamStats__score">
            {team.score}
        </div>
        <h2 className="TeamStats__name">
            <StatusDot on={enableDot} />
            <div className="TeamStats__name-label">{team.name}</div>
        </h2>
    </div>);
}

export default TeamStats;