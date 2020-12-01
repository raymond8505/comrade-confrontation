import React,{useContext,useState,useRef, useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import {fillArrayUnique} from '../helpers';

const QuestionPicker = ({questions = null,openOnInit}) => {

    const [open,setOpen] = useState(openOnInit);
    const {gameState,allQuestions,setGameRounds} = useContext(GameContext);
    const randomizeOptionsBtn = useRef(null);

    const [questionOptions,setQuestionOptions] = useState([]);
    const [chosenQuestions,setChosenQuestions] = useState([]);
    const [allQuestionsChosen,setAllQuestionsChosen] = useState(false);

    const getQuestionOptions = numQuestions => {
        const indexes = fillArrayUnique(0,questions.length - 1,4,chosenQuestions);

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
                {question.question}
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

        //console.log(gameState);
        setGameRounds(gameState.ID,chosenQuestions);
    }

    if(questions === null)
    {
        questions = allQuestions;
    }

    useEffect(()=>{

        setQuestionOptions(getQuestionOptions(4));

        return ()=>{}

    },[questions]);

    useEffect(()=>{
        setAllQuestionsChosen(chosenQuestions.length === 4);

    },[chosenQuestions.length]);

    return (<dialog className="QuestionPicker" open={open}>
        <div className="QuestionPicker__inner">
            <h2 className="QuestionPicker__title">Choose the Questions</h2>
            <h3>Chosen Questions</h3>
            <ul className="QuestionPicker__questions QuestionPicker__questions--chosen">
                {renderQuestions(chosenQuestions,removeQuestion)}
            </ul>
            <h3>Question Options</h3>
            <ul className="QuestionPicker__questions QuestionPicker__questions--to-choose">
                {renderQuestions(questionOptions,chooseQuestion)}
            </ul>
            <button ref={randomizeOptionsBtn} onClick={e=>setQuestionOptions(getQuestionOptions(4))}>4 More Options</button>
            {allQuestionsChosen ? 
                <button onClick={onConfirmQuestionsClick} className="cta">Confirm Choices</button> : null
            }
        </div>
    </dialog>);
}

export default QuestionPicker;