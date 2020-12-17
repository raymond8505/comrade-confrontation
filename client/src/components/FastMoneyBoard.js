import React,{useState,useContext} from "react";
import { GameContext } from "../contexts/gameContext";
import FastMoneyAnswers from "./FastMoneyAnswers";
import HostControls from "./HostControls";
import QuestionBoard from "./QuestionBoard";
import Timer from "./Timer";
import config from "../config.json"

const FastMoneyBoard = ({questions}) => {

    const {getCurrentRound,gameState,currentUserIsHost} = useContext(GameContext);
    const {game,currentFastMoneyPreview} = gameState;
    const round = getCurrentRound();
    const question = questions[currentFastMoneyPreview];

    const onQBAnswerClick = answer => {

        console.log(answer);

        if(lastFocusedPlayerAnswer !== null)
        {
            lastFocusedPlayerAnswer.value = answer.points;
        }
    }

    const [lastFocusedPlayerAnswer,setLastFocusedPlayerAnswer] = useState(null);
    
    const onPlayerAnswerPointsFocus = e => {
        setLastFocusedPlayerAnswer(e.currentTarget);
    }

    return (<div className="FastMoneyBoard">
        
        {currentUserIsHost() ? <div className="FastMoneyBoard__question-and-controls">
            <h3 className="FastMoneyBoard__question">{question.question}</h3>
            <HostControls />
        </div> : null}

        <div className="FastMoneyBoard__answers">
            {currentUserIsHost() ? <QuestionBoard question={question} onAnswerClick={onQBAnswerClick} /> : null}

            <div className="FastMoneyBoard__player-answers">
                <FastMoneyAnswers 
                    answers={round.playerAnswers[0]} 
                    index={0}
                    focusFirstOnStart={true}
                    onPointsFocus={onPlayerAnswerPointsFocus} />
                <FastMoneyAnswers 
                    answers={round.playerAnswers[1]} 
                    index={1}
                    onPointsFocus={onPlayerAnswerPointsFocus} />

                <div className="FastMoneyBoard__timer-wrapper">
                    {round.started ? <Timer time={config.FAST_MONEY.TIMERS[round.currentStage]} /> : null}
                </div>
            </div>
        </div>

        
        
    </div>);
}

export default FastMoneyBoard;