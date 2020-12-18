import React,{useContext, useEffect, useState} from "react";
import { GameContext } from "../contexts/gameContext";
import HostControls from './HostControls';

const QuestionBoard = ({question,onAnswerClick}) => {

    const {
        currentUserIsHost,
        sendCorrectAnswer,
        getCurrentRoundStage,
        getCurrentRoundPoints,
        getCurrentRound,
        revealAnswer,
        gameState} = useContext(GameContext);

    const handleAnswerClick = (e,index,answer) => {

        //only send correct answers in regular rounds
        //in fast money it's just for the host's reference
        //when reading the questions
        if(gameState.game.currentRound < 3 && getCurrentRound().started)
        {
            
            if(getCurrentRoundStage() < 4)
            {
                sendCorrectAnswer(index);
            }
            else
            {
                revealAnswer(gameState.game.ID,gameState.game.currentRound,index);
            }
        }

        if(onAnswerClick !== undefined)
        {
            onAnswerClick(answer);
        }
    }

    const renderAnswers = () => {

        const toRet = [];

        //console.log(gameState,currentUser);
        
        for(let i = 0; i < 8; i++)
        {   
            const answer = question.answers[i];
            const answerKey = `question_${question.ID}_answer_${i}`;
            const revealed = 
                answer !== undefined && (currentUserIsHost() || answer.answered || answer.revealed)

            toRet.push(<li className={`QuestionBoard__answer${
                                revealed && answer !== undefined  ? ' QuestionBoard__answer--revealed' : ''}${
                                    (answer != undefined && answer.answered) ? ' QuestionBoard__answer--answered' : ''
                                }${answer === undefined ? ' QuestionBoard__answer--disabled' : ''}`} 
                            key={answerKey}
                            onClick={(e)=>{
                                if(answer !== undefined && currentUserIsHost()) {
                                    handleAnswerClick(e,i,answer);
                                    }
                                }
                            }>
                    {
                        answer !== undefined && revealed ? 
                            <div className="QuestionBoard__answer-details">
                                <span className="QuestionBoard__answer-text">
                                    <span>{answer.answer}</span>
                                </span>
                                <span className="QuestionBoard__answer-points">
                                    <span>{answer.points}</span>
                                </span>
                            </div> 
                            : <span className="QuestionBoard__answer-num">{i + 1}</span>
                    }
            </li>);
        }

        return toRet;
    }
    return (<div className="QuestionBoard">
        
        {currentUserIsHost() ? 
            (<div className="QuestionBoard__question-and-controls">
                <h2 className="QuestionBoard__question">{question.question}</h2>
                <HostControls />
            </div>) : null}
        {getCurrentRound().type !== 'fast-money' ? <div className="QuestionBoard__board-score">{getCurrentRoundPoints()}</div> : null}
        <ul className="QuestionBoard__answers">
            {renderAnswers()}
        </ul>
    </div>);
}

export default QuestionBoard;