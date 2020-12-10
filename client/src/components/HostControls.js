import React,{useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const HostControls = ({}) => {

    const {getCurrentRound,
            startRound,
            stopRound,
            gotoNextRound} = useContext(GameContext);

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

    const handleNextRoundClick = e => {

        gotoNextRound();
    }

    return (<div className="HostControls">
        {getCurrentRound().currentStage !== 4 ? <button type="button" 
            className="HostControls__HostControl HostControls__HostControl--start-round"
            onClick={handleStartRoundClick}>
                {getCurrentRound().started ? 'Stop Round' : 'Start Round'}
        </button> : null}

        {getCurrentRound().currentStage === 4 ? <button type="button" class="HostControls__next-round-btn" onClick={handleNextRoundClick}>Next Round</button> : null}
    </div>);
}

export default HostControls;