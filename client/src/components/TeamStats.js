import React,{useContext, useState,useRef} from "react";
import {GameContext} from '../contexts/gameContext';
import StatusDot from "./StatusDot";

const TeamStats = ({team,enableDot = false,index}) => {

    const {toggleTeams,
        currentUserIsHost,
        editTeamScore} = useContext(GameContext);
    const [editing,setEditing] = useState(false);
    const scoreField = useRef(null);

    const handleDotClick = e => {
        
        if(currentUserIsHost())
        {
            toggleTeams();
        }
    }

    const onEditOrSaveClick = e => {

        if(editing)
        {
            editTeamScore(index,scoreField.current.value);
            setEditing(false);
        }
        else
        {
            setEditing(true);
            setTimeout(()=>{
                scoreField.current.focus();
            },10);
        }
    }

    return (<div className="TeamStats">
        
        <h2 className="TeamStats__name">
            <div onClick={handleDotClick}><StatusDot on={enableDot}  /></div>
            <div className="TeamStats__name-label">
                {team.name.substring(0,30)}
            </div>
        </h2>

        <div className={`TeamStats__score ${editing ? ' TeamStats__score--editing' : ''}`}>
            {editing && currentUserIsHost()  ? <input type="number" 
                            defaultValue={team.score} 
                            className="TeamStats__score-field"
                            onKeyDown={e=>{
                                if(e.which === 13)
                                {
                                    onEditOrSaveClick(e);
                                }
                            }}
                            ref={scoreField} /> : <span className="TeamStats__score-wrap">{team.score}</span>}
            {currentUserIsHost() ? editing ? <button 
                            onClick={onEditOrSaveClick}
                            className="TeamStats__btn TeamStats__btn--confirm-edit">
                                <i className="fas fa-check"></i>
                        </button> : 
                        <button 
                            onClick={onEditOrSaveClick}
                            className="TeamStats__btn TeamStats__btn--edit">
                                <i className="fas fa-pencil-alt"></i>
                        </button> : null}
        </div>
    </div>);
}

export default TeamStats;