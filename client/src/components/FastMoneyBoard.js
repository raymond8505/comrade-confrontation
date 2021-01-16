import React,{useState,useContext,useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import FastMoneyAnswers from "./FastMoneyAnswers";
import HostControls from "./HostControls";
import QuestionBoard from "./QuestionBoard";
import Timer from "./Timer";
import config from "../config.json"
import { calculateFastMoneyTotal } from "../helpers";
import FastMoneyInstructionsModal from "./FastMoneyInstructionsModal";
import FieldSet from './FieldSet';

const FastMoneyBoard = ({questions}) => {

    const {getCurrentRound,gameState,currentUserIsHost,broadcastSound,startRound,stopRound} = useContext(GameContext);
    const {game,currentFastMoneyPreview} = gameState;
    const round = getCurrentRound();
    const question = questions[currentFastMoneyPreview];

    const onQBAnswerClick = answer => {

        console.log(answer);

        if(lastFocusedPlayerAnswer !== null)
        {
            lastFocusedPlayerAnswer.value = answer.points;
            lastFocusedPlayerAnswer.focus();
        }
    }

    const [lastFocusedPlayerAnswer,setLastFocusedPlayerAnswer] = useState(null);
    
    const onPlayerAnswerPointsFocus = e => {

        console.log(e);
        setLastFocusedPlayerAnswer(e.currentTarget);
    }

    const escListener = e => {

        if(e.which === 27 && currentUserIsHost())
        {
            e.stopPropagation();
            e.preventDefault();
            broadcastSound('wrong');
        }
        
    }

    useEffect(()=>{

        window.addEventListener('keydown',escListener);
        return ()=>{
            window.removeEventListener('keydown',escListener);
        }

    },[]);
    return (<div className="FastMoneyBoard">
        
        {currentUserIsHost() ? <div className="FastMoneyBoard__question-and-controls">
            <h3 className="FastMoneyBoard__question">{question.question}</h3>
            <HostControls />
        </div> : null}

        <div className="FastMoneyBoard__answers">
            {currentUserIsHost() ? <div className="FastMoneyBoard__question-board-wrap">
                <FieldSet extraClasses={["FastMoneyBoard__stakes"]} legend="Stakes">
                    {game.fastMoneyStakes}
                </FieldSet>
                
                {
                    //only show answer board if round is stopped. So as not to distract host
                    round.started ? null : <QuestionBoard question={question} onAnswerClick={onQBAnswerClick} />
                }
                <FastMoneyInstructionsModal />
            </div> : null}

            <div className="FastMoneyBoard__player-answers">
                <FastMoneyAnswers 
                    answers={round.playerAnswers[0]} 
                    index={0}
                    focusFirstOnStart={round.currentStage === 0}
                    onPointsFocus={onPlayerAnswerPointsFocus} />
                <FastMoneyAnswers 
                    answers={round.playerAnswers[1]} 
                    index={1}
                    focusFirstOnStart={round.currentStage === 1}
                    onPointsFocus={onPlayerAnswerPointsFocus} />

                <div className="FastMoneyBoard__footer">

                    {round.started ? <Timer time={config.FAST_MONEY.TIMERS[round.currentStage]} onComplete={()=>{
                        broadcastSound('wrong');
                        console.log('timer complete');

                        setTimeout(()=>{
                            stopRound();
                        },500);
                        
                        
                    }} /> : null}
                    
                    <div className="FastMoneyBoard__combined-total">
                        <span className="FastMoneyBoard__combined-total-label">Total:</span>
                        <span className="FastMoneyBoard__combined-total-amount">{
                            calculateFastMoneyTotal([
                                ...round.playerAnswers[0],
                                ...round.playerAnswers[1]
                            ],currentUserIsHost)
                        }</span>
                    </div>
                </div>
            </div>
        </div>

        
        
    </div>);
}

export default FastMoneyBoard;