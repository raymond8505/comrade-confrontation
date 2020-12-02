import React,{useContext,useRef} from "react";
import { GameContext } from "../contexts/gameContext";

const QuestionBoard = ({question}) => {

    const {currentUserIsHost,currentUser} = useContext(GameContext);
    
    const renderAnswers = () => {

        const toRet = [];
        
        for(let i = 0; i < 8; i++)
        {   
            const answer = question.answers[i];
            const answerKey = `question_${question.ID}_answer_${i}`;
            const revealed = 
                answer !== undefined && (currentUserIsHost() || answer.answered)

                // console.log(i,currentUserIsHost(), 
                // (answer !== undefined && answer.answered));
                // console.log(currentUser);

            toRet.push(<li className={`QuestionBoard__answer${
                revealed ? ' QuestionBoard__answer--revealed' : ''}`} key={answerKey}>
                {
                    answer !== undefined ? 
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
        
        <h2 className="QuestionBoard__question">
            {question.question}
        </h2>
        <ul className="QuestionBoard__answers">
            {renderAnswers()}
        </ul>
    </div>);
}

export default QuestionBoard;