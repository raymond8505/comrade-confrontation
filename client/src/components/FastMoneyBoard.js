import React,{useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";
import FastMoneyAnswers from "./FastMoneyAnswers";
import HostControls from "./HostControls";
import QuestionBoard from "./QuestionBoard";
import Timer from "./Timer";

const FastMoneyBoard = ({questions}) => {

    const {getCurrentRound,gameState,currentUserIsHost} = useContext(GameContext);
    const {game,currentFastMoneyPreview} = gameState;
    const round = getCurrentRound();
    const question = questions[currentFastMoneyPreview];

    console.log(round.currentStage);

    return (<div className="FastMoneyBoard">
        
        {currentUserIsHost() ? <div className="FastMoneyBoard__question-and-controls">
            <h3 className="FastMoneyBoard__question">{question.question}</h3>
            <HostControls />
        </div> : null}

        <div className="FastMoneyBoard__answers">
            {currentUserIsHost() ? <QuestionBoard question={question} /> : null}

            <div className="FastMoneyBoard__player-answers">
                <FastMoneyAnswers answers={round.playerAnswers[0]} index={0} />
                <FastMoneyAnswers answers={round.playerAnswers[1]} index={1} />

                <div className="FastMoneyBoard__timer-wrapper">
                    {round.started ? <Timer time={round.currentStage === 0 ? 20 : 25} /> : null}
                </div>
            </div>
        </div>

        
        
    </div>);
}

export default FastMoneyBoard;