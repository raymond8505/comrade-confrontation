import React,{useContext,useRef} from "react";
import { GameContext } from "../contexts/gameContext";
import HostControls from './HostControls';

const QuestionBoard = ({question}) => {

    const {
        currentUserIsHost,
        currentUser,
        gameState} = useContext(GameContext);
    
    const renderAnswers = () => {

        const toRet = [];

        console.log(gameState,currentUser);
        
        for(let i = 0; i < 8; i++)
        {   
            const answer = question.answers[i];
            const answerKey = `question_${question.ID}_answer_${i}`;
            const revealed = 
                answer !== undefined && (currentUserIsHost() || answer.answered)

            toRet.push(<li className={`QuestionBoard__answer${
                revealed ? ' QuestionBoard__answer--revealed' : ''}`} key={answerKey}>
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
        <ul className="QuestionBoard__answers">
            {renderAnswers()}
        </ul>
    </div>);
}

export default QuestionBoard;