import React,{useContext} from "react";
import {GameContext} from '../contexts/gameContext';
import StatusDot from "./StatusDot";

const TeamStats = ({team,enableDot = false}) => {

    const {toggleTeams,
        currentUserIsHost} = useContext(GameContext);

    const handleDotClick = e => {
        
        if(currentUserIsHost())
        {
            toggleTeams();
        }
    }

    return (<div className="TeamStats">
        
        <h2 className="TeamStats__name">
            <div onClick={handleDotClick}><StatusDot on={enableDot}  /></div>
            <div className="TeamStats__name-label">{team.name.substring(0,30)}</div>
        </h2>

        <div className="TeamStats__score">
            {team.score}
        </div>
    </div>);
}

export default TeamStats;