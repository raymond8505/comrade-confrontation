import React,{useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";
import Loading from "./Loading";

const HostControls = ({}) => {

    const {getCurrentRound,
            startRound,
            stopRound,
            gotoNextRound,
            gameState,
            replaceQuestion,
            loadingQuestion,
            skipToRound} = useContext(GameContext);

    const {game} = gameState;

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

    const handleNewQuestionClick = e => {
        replaceQuestion(game.currentRound);
    }

    const onNextRoundClick = e => {

        if(game.currentRound === 2)
        {
            gotoNextRound();
        }
        else
        {
            skipToRound(game.currentRound + 1);
        }
        
    }

    const onPrevRoundClick = e => {
        skipToRound(game.currentRound - 1);
    }

    return (<div className="HostControls">
        <div className="HostControls__rounds-nav">
            <div>
                {game.currentRound > 0 ? <button 
                    onClick={onPrevRoundClick}
                    className="HostControls__HostControl HostControls__HostControl--prev-round">
                    &lt; Prev
                </button> : null}
            </div>
            <div>
                {game.currentRound < 3 ? 
                    <button 
                        onClick={onNextRoundClick}
                        className="HostControls__HostControl HostControls__HostControl--next-round">
                    Next &gt;
                </button> : null}
            </div>
        </div>
        {getCurrentRound().currentStage !== 4 ? <button type="button" 
            className="HostControls__HostControl HostControls__HostControl--start-round"
            onClick={handleStartRoundClick}>
                {getCurrentRound().started ? 'Stop Round' : 'Start Round'}
        </button> : null}

        {getCurrentRound().currentStage === 4 ? 
                <button type="button" className="HostControls__HostControl HostControls__HostControl--next-round" onClick={handleNextRoundClick}>Next Round</button> 
                : null}

        {getCurrentRound().type === 'regular' ? 
                loadingQuestion ? <Loading /> : <button type="button" className="HostControls__HostControl HostControls__HostControl--new-question" onClick={handleNewQuestionClick}>Replace Question</button>
                : null}
    </div>);
}

export default HostControls;