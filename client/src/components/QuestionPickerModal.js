import React,{useContext,useState,useRef, useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import {fillArrayUnique, maybePlural} from '../helpers';

import sampleQuestions from '../data/sample-questions.json';
import allQuestions from '../data/real-questions.json';
import FieldSet from "./FieldSet";

const QuestionPickerModal = ({questions = null,openOnInit,numQuestions = 3}) => {

    const [open,setOpen] = useState(openOnInit);
    
    const {gameState,setGameRounds,setFastMoneyQuestions,getGameQuestions,getLeadingTeam} = useContext(GameContext);

    const {game} = gameState;

    const gameID = game.ID;

    const randomizeOptionsBtn = useRef(null);

    const [questionOptions,setQuestionOptions] = useState([]);
    const [chosenQuestions,setChosenQuestions] = useState([]);
    const [allQuestionsChosen,setAllQuestionsChosen] = useState(false);
    
    const gameIDs = game.currentRound === 3 ? getGameQuestions().map(q=>q.ID) : [];

    let rrQuestions = [];

    const getQuestionOptions = numQuestions => {

        const qs = gameState.game.currentRound === 3 ? rrQuestions : questions;

        const indexes = fillArrayUnique(0,qs.length - 1,numQuestions,[
            ...chosenQuestions,
            ...gameIDs //if we're picking for fast money, exclude the game questions
        ]);

        return indexes.map(i => qs[i]);
    }

    /**
     * 
     * @param {Object[]} questionsToRender an array of question objects to render
     * @param {Function} onClick a function to pass the question's ID to
     */
    const renderQuestions = (questionsToRender,onClick) => {

        return questionsToRender.map((question,i) => {
            return <li key={`qpq_${question.ID}`} 
                       className="QuestionPicker__Question QuestionPicker__Question--option"
                       onClick={e => onClick(question)}>
                {question.question} <span className="QuestionPicker__Question-answer-count">({question.answers.length})</span>
            </li>
        })
    }

    const chooseQuestion = question => {
        
        const questionIndex = questionOptions.findIndex(q => q.ID === question.ID);

        setQuestionOptions(questionOptions.filter(q => q.ID !== question.ID));

        chosenQuestions.push(question);

        setChosenQuestions(chosenQuestions);
    }

    const removeQuestion = question => {
        setChosenQuestions(chosenQuestions.filter(q => q.ID !== question.ID));
    }

    const onConfirmQuestionsClick = e => {

        //round 3 = fast money / rapid rubles
        if(game.currentRound === 3)
        {
            setFastMoneyQuestions(gameID,chosenQuestions);
        }
        else
        {
            setGameRounds(gameID,chosenQuestions);
        }
    }

    if(questions === null)
    {
        questions = window.location.host.indexOf('localhost') > -1 ? sampleQuestions : allQuestions;

        //filter to only questions with 3 or 4 answers
        //for rapid rubles
        if(gameState.game.currentRound === 3)
        {
            rrQuestions = questions.filter(q => q.answers.length <= 4);
        }
    }

    useEffect(()=>{

        setQuestionOptions(getQuestionOptions(numQuestions));

        return ()=>{}

    },[questions]);

    useEffect(()=>{
        setAllQuestionsChosen(chosenQuestions.length === numQuestions);

    },[chosenQuestions.length]);

    return (<dialog className="QuestionPicker modal" open={open}>
        <div className="QuestionPicker__inner modal__inner">
            <h2 className="QuestionPicker__title">Choose the Questions</h2>

            {gameState.game.fastMoneyStakes === '' ? null : 
                <FieldSet legend="Stakes" extraClasses={["QuestionPicker__stakes"]}>
                    {`Stakes: ${gameState.game.fastMoneyStakes}`}</FieldSet>}

            <h3>Chosen Questions</h3>
            {chosenQuestions.length === 0 ? <span className="placeholder">No questions chosen. Click a question below to choose it</span> : null}
            
            <ul className="QuestionPicker__questions QuestionPicker__questions--chosen">
                {renderQuestions(chosenQuestions,removeQuestion)}
            </ul>
            <h3>Question Options</h3>
            <ul className="QuestionPicker__questions QuestionPicker__questions--to-choose">
                {renderQuestions(questionOptions,chooseQuestion)}
            </ul>
            <button ref={randomizeOptionsBtn} onClick={e=>setQuestionOptions(getQuestionOptions(numQuestions))}>{numQuestions} More Options</button>
            {allQuestionsChosen ? 
                <button onClick={onConfirmQuestionsClick} className="cta">Confirm Choices</button> : null
            }

            {gameState.game.currentRound === 3 ? <div className="QuestionPickerModal__instructions">
                <h3>Instructions</h3>

                <strong>{getLeadingTeam().name}</strong> Pick{maybePlural(getLeadingTeam().name)} 2 players to play Rapid Rubles. Ensure they know who is going first or second. The person
                going second should avoid looking at the screen or hearing player 1's answers.

                Pick <strong>5</strong> questions. From above. The questions have been filtered to 3 or 4 answer questions only.

            </div> : null}
        </div>
    </dialog>);
}

export default QuestionPickerModal;