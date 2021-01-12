import React,{useContext, useState} from "react";
import {GameContext} from '../contexts/gameContext';
import StatusDot from "./StatusDot";

const TeamStats = ({team,enableDot = false}) => {

    const {toggleTeams,
        currentUserIsHost} = useContext(GameContext);
    const [editing,setEditing] = useState(false);

    const handleDotClick = e => {
        
        if(currentUserIsHost())
        {
            toggleTeams();
        }
    }

    return (<div className="TeamStats">
        
        <h2 className="TeamStats__name">
            <div onClick={handleDotClick}><StatusDot on={enableDot}  /></div>
            <div className="TeamStats__name-label">
                {team.name.substring(0,30)}
            </div>
        </h2>

        <div className="TeamStats__score">
            {editing ? <input type="number" defaultValue={team.score} className="TeamStats__score-field" /> : team.score}
            {editing ? <button className="TeamStats__confirm-edit"><i className="fas fa-check"></i></button> : 
                            <button className="TeamStats__edit"><i className="fas fa-edit"></i></button>}
        </div>
    </div>);
}

export default TeamStats;