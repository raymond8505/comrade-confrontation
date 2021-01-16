import React,{useContext, useEffect, useState} from "react";
import { GameContext } from "../contexts/gameContext";
import HostControls from './HostControls';
import {isLocal} from '../helpers';

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

        console.log('handle answer click');
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

        
    }

    const renderAnswers = () => {

        const toRet = [];

        //console.log(gameState,currentUser);
        
        for(let i = 0; i < 8; i++)
        {   
            const answer = question.answers[i];
            const answerKey = `question_${question.ID}_answer_${i}`;
            const exists = answer !== undefined;
            const revealed = exists && answer.revealed === true;
            const answered = exists && answer.answered;

            toRet.push(<li className={`QuestionBoard__answer${
                            revealed ? ' QuestionBoard__answer--revealed' : ''}${
                            answered ? ' QuestionBoard__answer--answered' : ''}${
                            !exists  ? ' QuestionBoard__answer--disabled' : ''}`}
                            key={answerKey}
                            onClick={(e)=>{
                                if(answer !== undefined //answer exists
                                    && currentUserIsHost() //and current user is host
                                    && (gameState.lastBuzz !== undefined || isLocal()) //someone has buzzed or we're on localhost
                                    ) 
                                    {
                                        handleAnswerClick(e,i,answer);
                                    }

                                    if(onAnswerClick !== undefined)
                                    {
                                        onAnswerClick(answer);
                                    }
                                }

                                
                            }>
                    {
                        (exists && (currentUserIsHost() || answered || revealed)) ? 
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
                <h2 className="QuestionBoard__question">
                    {getCurrentRound().started ? question.question : <span>Press Start Round<i className="fas fa-arrow-right"></i></span>}
                </h2>
                <HostControls />
            </div>) : null}
        {getCurrentRound().type !== 'fast-money' ? <div className="QuestionBoard__board-score">{getCurrentRoundPoints()}</div> : null}
        <ul className="QuestionBoard__answers">
            {renderAnswers()}
        </ul>
    </div>);
}

export default QuestionBoard;