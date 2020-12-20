import React,{useContext,useState,useRef, useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import {fillArrayUnique} from '../helpers';

import sampleQuestions from '../data/sample-questions.json';
import allQuestions from '../data/real-questions.json';

const QuestionPicker = ({questions = null,openOnInit,numQuestions = 3,onChange = ()=>{}}) => {

    const [open,setOpen] = useState(openOnInit);
    
    const {gameState,setGameRounds,setFastMoneyQuestions,getGameQuestions} = useContext(GameContext);

    const {game} = gameState;

    const gameID = game.ID;

    const randomizeOptionsBtn = useRef(null);

    const [questionOptions,setQuestionOptions] = useState([]);
    const [chosenQuestions,setChosenQuestions] = useState([]);
    const [allQuestionsChosen,setAllQuestionsChosen] = useState(false);
    
    const gameIDs = game.currentRound === 3 ? getGameQuestions().map(q=>q.ID) : [];

    useEffect(()=>{

        onChange(chosenQuestions);

    },[chosenQuestions.length]);

    const getQuestionOptions = numQuestions => {
        const indexes = fillArrayUnique(0,questions.length - 1,numQuestions,[
            ...chosenQuestions,
            ...gameIDs //if we're picking for fast money, exclude the game questions
        ]);

        return indexes.map(i => questions[i]);
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
        setQuestionOptions([
            ...questionOptions,
            question
        ]);
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
    }

    useEffect(()=>{

        setQuestionOptions(getQuestionOptions(numQuestions));

        return ()=>{}

    },[questions]);

    useEffect(()=>{
        setAllQuestionsChosen(chosenQuestions.length === numQuestions);

    },[chosenQuestions.length]);

    return (<div className="QuestionPicker">

            <h3>Chosen Questions</h3>
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
        </div>);
}

export default QuestionPicker;