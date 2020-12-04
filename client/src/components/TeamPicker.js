import React,{useContext,useRef,useState} from "react";
import { GameContext } from "../contexts/gameContext";

const TeamPicker = ({teams,suggestedTeam = 0}) => {

    const [chosenTeam,setChosenTeam] = useState(suggestedTeam);
    
    const {joinTeam} = useContext(GameContext);

    const onTeamChange = e => {
        setChosenTeam(Number(e.target.value));
    }

    const handleJoinTeam = e => {     
        joinTeam(chosenTeam);
    }

    return (<fieldset className="TeamPicker">
        <legend>Choose A Team</legend>

        <div className="TeamPicker__inner">
            {teams.map((t,i) => {
                return (<label key={i}>
                    <input 
                        type="radio" 
                        name="chosen-team" 
                        value={i} 
                        defaultChecked={i === chosenTeam}
                        onChange={onTeamChange} />
                    <span>{t.name}</span>
                </label>)
            })}

            <button type="button" className="TeamPicker__cta cta" onClick={handleJoinTeam}>Join Team</button>
        </div>


    </fieldset>);
}

export default TeamPicker;