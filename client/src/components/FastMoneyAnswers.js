import { indexOf, round } from "lodash";
import React,{useContext, useRef,useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import { nbsp,calculateFastMoneyTotal,getParentWithClass } from "../helpers";
import config from "../config.json";

const FastMoneyAnswers = ({answers,index,focusFirstOnStart = false,onPointsFocus}) => {

    const {setCurrentFastMoneyPreview,
            currentUserIsHost,
            getCurrentRound,
            gameState,
            setFastMoneyAnswers,
            toggleFastMoneyAnswer} = useContext(GameContext);
    
    const answerFields = [];
    const round = getCurrentRound();

    //can't declare hooks in loops :/
    answerFields[0] = useRef(null);
    answerFields[1] = useRef(null);
    answerFields[2] = useRef(null);
    answerFields[3] = useRef(null);
    answerFields[4] = useRef(null);
             
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

    const getPointsFieldFromAnswerField = answerField => 
                    getParentWithClass(answerField,'FastMoneyAnswers__answer').querySelector('input[type="number"]');

    const renderAnswerText = (answer,i) =>
    {
        const text = answer === undefined ? '' : answer.answer;

        return currentUserIsHost() ? makeInput(text,i,'text',()=>{},e=>{

            const currentTarget = getPointsFieldFromAnswerField(e.currentTarget);

            onPointsFocus({currentTarget});
            
        }) : text;
    }

    const renderAnswerPoints = (answer,i) =>
    {
        const text = answer === undefined ? '' : answer.points;

        return currentUserIsHost() ? makeInput(text,i,'number',()=>{},onPointsFocus) : text;
    }
    
    const renderAnswers = answers => {

        console.log('rendering answers',answers);
        const toRet = [];

        for(let i = 0; i < 5; i++)
        {
            const answer = answers[i];

            toRet.push(<li key={`answer_${i}`} 
                            className={`FastMoneyAnswers__answer 
                            ${answer !== undefined && answer.revealed ? ' FastMoneyAnswers__answer--revealed' : ''}`}
                            ref={answerFields[i]}>
                <span className="FastMoneyAnswers__answer-text">
                    <span>{renderAnswerText(answer,i)}</span>
                </span>
                <span className="FastMoneyAnswers__answer-points">
                    <span>{renderAnswerPoints(answer,i)}</span>
                </span>
                {currentUserIsHost() && answer !== undefined ? <button 
                                            tabIndex="-1" 
                                            className={`FastMoneyAnswer__toggle-answer-reveal`}
                                            onClick={e=>onToggleRevealClick(i)}>
                                                <i className={`far ${answer.revealed ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button> : null}
            </li>);
        }

        return toRet;
    }

    const focusAnswer = i => {
        answerFields[i].current.querySelector('input[type="text"]').focus();
    }

    /**
     * REFACTOR THIS OMG
     * @param {*} val 
     * @param {*} questionIndex 
     * @param {*} type 
     * @param {*} onBlur 
     * @param {*} onFocus 
     */
    const makeInput = (val,questionIndex,type="text",onBlur=()=>{},onFocus) => {

        console.log(type,round.started);

        return <input 
            type={type} 
            defaultValue={val} 
            onBlur={onBlur}
            onKeyDown={(e)=>{

                if((e.which === 13 || e.which === 40) && (questionIndex < 4))
                {
                    focusAnswer(questionIndex + 1);
                }
                else if(e.which === 38 && (questionIndex > 0))
                {
                    focusAnswer(questionIndex - 1);
                }
            }}
            onFocus={e=>{
                onAnswerFocus(questionIndex)
                if(onFocus !== undefined)
                {
                    //console.log(onFocus);
                    onFocus(e);
                }
            }}
            disabled={type === 'number' && round.started}
            readOnly={!currentUserIsHost()}
            className={`FastMoneyAsnwers__input FastMoneyAsnwers__input--${type === 'text' ? 'answer' : 'points'}`} />
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

    return (<div className="FastMoneyAnswers">
    
                {currentUserIsHost() ? <h4 className="FastMoneyAnswers__title">Player {index + 1} ({config.FAST_MONEY.TIMERS[index]}s)</h4> : null}
                <ul ref={answersShell} className="FastMoneyAnswers__answers">
                    
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
                            {calculateFastMoneyTotal(answers,currentUserIsHost() || index === 0)}
                        </span>
                    </li>
                </ul>

            </div>);
}

export default FastMoneyAnswers;