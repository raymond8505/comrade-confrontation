import React,{useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const HostControls = ({}) => {

    const {gameState,
            getCurrentRound,
            startRound,
            stopRound} = useContext(GameContext);

    const handleStartRoundClick = e => {

        if(getCurrentRound().started)
        {
            stopRound();
        }
        else
        {
            startRound();
        }
    }

    return (<div className="HostControls">
        <button type="button" 
            className="HostControls__HostControl HostControls__HostControl--start-round"
            onClick={handleStartRoundClick}>
                {getCurrentRound().started ? 'Stop Round' : 'Start Round'}
        </button>  
    </div>);
}

export default HostControls;