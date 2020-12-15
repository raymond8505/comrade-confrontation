import React,{useContext,usRef} from "react";
import { GameContext } from "../contexts/gameContext";

const PassOrPlay = ({round}) => {
    
    const {gameState,
            currentUserIsHost,
            chooseTeamForRound,} = useContext(GameContext);

    const handleTeamClick = i => {

        if(currentUserIsHost())
        {
            chooseTeamForRound(i);
        }
        else
        {
            alert(`Don't tell me! Tell the host!`);
        }
    }

    return (<dialog className={`PassOrPlay${currentUserIsHost() ? ' modal' : ''}`} open>
        <div className={`PassOrPlay__inner${currentUserIsHost() ? ' modal__inner' : ''}`}>
            <h2 className="PassOrPlay__title">Pass or Play?</h2>
            <h3>Which team will play round {gameState.game.rounds[round].number}</h3>

            {gameState.game.teams.map((t,i)=>{
                return (<button 
                            type="button" 
                            key={`team_${i}`} 
                            className={`PassOrPlay__team-btn PassOrPlay__team-btn--${i}`}
                            onClick={e => {handleTeamClick(i)}}>{t.name}</button>);
            })}
        </div>
    </dialog>);
}

export default PassOrPlay;