import { indexOf } from "lodash";
import React,{useContext, useRef,useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import { nbsp } from "../helpers";

const FastMoneyAnswers = ({answers,index,focusFirstOnStart = false}) => {

    const {setCurrentFastMoneyPreview,
            currentUserIsHost,
            getCurrentRound,
            gameState,
            setFastMoneyAnswers,
            toggleFastMoneyAnswer} = useContext(GameContext);
             
    const answersShell = useRef(null);

    useEffect(()=>{

        if(focusFirstOnStart && currentUserIsHost() && getCurrentRound().started)
        {
            answersShell.current.querySelectorAll('input[type="text"]')[0].focus();
        }

    },[gameState.game.rounds[gameState.game.currentRound].started]);

    const onAnswerFocus = i => {
        setCurrentFastMoneyPreview(i);
    }

    const onToggleRevealClick = i => {
        toggleFastMoneyAnswer(i,index);
    }

    const renderAnswerText = (answer,i) =>
    {
        const text = answer === undefined || (!currentUserIsHost() && !answer.revealed) ? nbsp : answer.answer;

        return currentUserIsHost() ? makeInput(text,i,'text') : text;
    }

    const renderAnswerPoints = (answer,i) =>
    {
        const text = answer === undefined || (!currentUserIsHost() && !answer.revealed) ? nbsp : answer.points;

        return currentUserIsHost() ? makeInput(text,i,'number') : text;
    }
    
    const renderAnswers = answers => {

        console.log('rendering answers',answers);
        const toRet = [];

        for(let i = 0; i < 5; i++)
        {
            const answer = answers[i];

            if(answer !== undefined)
                console.log(i,answer.revealed);

            toRet.push(<li key={`answer_${i}`} className={`FastMoneyAnswers__answer ${answer !== undefined && answer.revealed ? ' FastMoneyAnswers__answer' : ''}`}>
                <span className="FastMoneyAnswers__answer-text">
                    {renderAnswerText(answer,i)}
                </span>
                <span className="FastMoneyAnswers__answer-points">
                    {renderAnswerPoints(answer,i)}
                </span>
                {currentUserIsHost() ? <button 
                                            tabIndex="-1" 
                                            className={`FastMoneyAnswer__toggle-answer-reveal`}
                                            onClick={e=>onToggleRevealClick(i)}>
                                            
                                            {currentUserIsHost() && answer !== undefined ? 
                                                <i className={`far ${answer.revealed ? 'fa-eye-slash' : 'fa-eye'}`}></i> : 
                                            null}
                                        </button> : null}
            </li>);
        }

        return toRet;
    }

    const makeInput = (val,questionIndex,type="text",onBlur=()=>{}) => <input 
                                                                            type={type} 
                                                                            defaultValue={val} 
                                                                            onFocus={e=>onAnswerFocus(questionIndex)}
                                                                            onBlur={onBlur}
                                                                            readOnly={!currentUserIsHost()} />

    const calculateTotal = answers => {

        if(answers.length > 0)
        {
            const tot = answers.reduce((runningTot,a)=>{

                return a.revealed || currentUserIsHost() ? a.points + runningTot : runningTot;
            },0);

            return tot;
        }
        
        return nbsp;
    }

    const onSubmitClick = e => {
        
        const answersToParse = answersShell.current.querySelectorAll('li');
        const answersToSend = [];

        answersToParse.forEach((answer,i)=>{

            const textField = answer.querySelector('input[type="text"]');
            const pointsField = answer.querySelector('input[type="number"]');

            if(textField !== null)
            {
                const toSend = {
                    'answer' : textField.value.trim(),
                    'points' : Number(pointsField.value.trim()),
                    'revealed' : false
                }
    
                answersToSend.push(toSend);
            }
        });

        setFastMoneyAnswers(gameState.game.ID,answersToSend,index);
    }

    return (<ul className="FastMoneyAnswers" ref={answersShell}>
        
        {renderAnswers(answers)}
        <li className="FastMoneyAnswers__total">
            {currentUserIsHost() ? 
                <button tabIndex="-1" type="button" className="FastMoneyAnswers__submit-btn" onClick={onSubmitClick}>Submit</button> :
                null
            }
            <span className="FastMoneyAnswers__answer-text">
                Total:
            </span>
            <span className="FastMoneyAnswers__answer-points FastMoneyAnswers__answer-points--total">
                {calculateTotal(answers)}
            </span>
        </li>
    </ul>);
}

export default FastMoneyAnswers;