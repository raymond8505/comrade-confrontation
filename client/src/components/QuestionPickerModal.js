import React,{useContext,useState,useRef, useEffect} from "react";
import { GameContext } from "../contexts/gameContext";
import { maybePlural} from '../helpers';

import sampleQuestions from '../data/sample-questions.json';
import allQuestions from '../data/real-questions.json';
import FieldSet from "./FieldSet";
import {useQuery} from '@apollo/client';
import {ALL_QUESTIONS} from '../queries';
import QuestionPicker from "./QuestionPicker";
import Loading from "./Loading";

const QuestionPickerModal = ({openOnInit,numQuestions = 3,minAnswers=0,maxAnswers=8}) => {

    const [open,setOpen] = useState(openOnInit);

    const [questions,setQuestions] = useState([]);
    
    const {gameState,getLeadingTeam} = useContext(GameContext);

    const {game} = gameState;

    const {loading,data} = useQuery(ALL_QUESTIONS);

    useEffect(()=>{
        
        if(!loading)
        {
            setQuestions(data.questions.filter(q=>{

                return q.answers.length >= minAnswers && q.answers.length <= maxAnswers;

            }));
        }

    },[loading]);
    

    let rrQuestions = [];



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

    return (<dialog className="QuestionPicker modal" open={open}>
        <div className="QuestionPicker__inner modal__inner">
            <h2 className="QuestionPicker__title">Choose the Questions</h2>

            {gameState.game.fastMoneyStakes === '' ? null : 
                <FieldSet legend="Stakes" extraClasses={["QuestionPicker__stakes"]}>
                    {`Stakes: ${gameState.game.fastMoneyStakes}`}</FieldSet>}

            <FieldSet legend="Questions" extraClasses={['QuestionPickerModal__questions']}>

                {loading ? <Loading /> : <QuestionPicker 
                    questions={questions} numQuestions={numQuestions} />}

            </FieldSet>

            {gameState.game.currentRound === 3 ? <div >
                <FieldSet legend="Instructions" extraClasses={["QuestionPickerModal__instructions"]}>

                    <strong>{getLeadingTeam().name}</strong> Pick{maybePlural(getLeadingTeam().name)} 2 players to play Rapid Rubles. Ensure they know who is going first or second. The person
                    going second should avoid looking at the screen or hearing player 1's answers.

                    Pick <strong>5</strong> questions from above. The questions have been filtered to 3 or 4 answer questions only.

                </FieldSet></div> : null}
        </div>
    </dialog>);
}

export default QuestionPickerModal;