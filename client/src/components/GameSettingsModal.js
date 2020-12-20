import React,{useContext,useRef,useState} from "react";
import FieldSet from "./FieldSet";
import QuestionPicker from "./QuestionPicker";
import defaultStakes from "../data/stakes.json";
import defaultNames from "../data/team-names.json";
import {randomItem} from "../helpers";
import { GameContext } from "../contexts/gameContext";

const GameSettingsModal = ({}) => {

    const [chosenQuestions,setChosenQuestions] = useState([]);
    const [canSubmit,setCanSubmit] = useState(false);

    const team1 = useRef(null);
    const team2 = useRef(null);
    const rrStakes = useRef(null);

    const {setGameSettings} = useContext(GameContext);

    /**
     * Called by the question picker every time the chosen questions change
     * @param {Object[]} chosenQuestions an array of the chosen questions
     */
    const onQuestionsChange = chosenQuestionsIn => {

        setChosenQuestions(chosenQuestionsIn);
        setCanSubmit(chosenQuestionsIn.length === 3);
        
    }

    const handleSubmit = e => {

        const team1NameVal = team1.current.value;
        const team2NameVal = team2.current.value;
        const rrStakesVal = rrStakes.current.value;
        
        const team1Name = team1NameVal === '' ? randomItem(defaultNames) : team1NameVal;
        const team2Name = team2NameVal === '' ? randomItem(defaultNames, defaultNames[team1NameVal]) : team2NameVal;
        const stakes = rrStakesVal === '' ? randomItem(defaultStakes) : rrStakesVal;

        setGameSettings(team1Name,team2Name,stakes,chosenQuestions);
    }

    return (<dialog className="GameSettingsModal modal" open>
        <div className="modal__inner GameSettingsModal__inner">
            <h2 className="GameSettingsModal__title">
                <span>Game Settings</span>
                <button type="button" className="cta" disabled={!canSubmit} onClick={handleSubmit}>Start Game</button>
            </h2>
            <p className="GameSettingsModal__description GameSettingsModal__description--modal-desc">
                Before we being, we need to set some things up.
            </p>
            <FieldSet legend="Team Settings" extraClasses={['GameSettingsModal__team-settings']}>
                <input type="text" placeholder="Team 1 Name" ref={team1} />
                <input type="text" placeholder="Team 2 Name" ref={team2} />
            </FieldSet>

            <FieldSet legend="Regular Round Questions" extraClasses={['GameSettingsModal__questions']}>
                <p className="GameSettingsModal__description GameSettingsModal__description--rrq">
                    <strong>Choose 3 questions</strong> for the regular rounds. You'll be prompted to choose the 5 Rapid Rubles 
                    questions after round 3.<br />
                    Click questions under <strong>Question Options</strong> to choose them for the game. 
                    Click them again under <strong>Chosen Questions</strong> to un-choose<br />
                    Click <strong>3 More Options</strong> for 3 new random options
                </p>

                <QuestionPicker numQuestions={3} onChange={onQuestionsChange} />
            </FieldSet>

            <FieldSet legend="Rapid Rubles Stakes" extraClasses={['GameSettingsModal__rr-stakes']}>
                <textarea 
                    placeholder="ex: losing team drinks. If left blank, stakes will be chosen for you at random"
                    ref={rrStakes}
                ></textarea>
            </FieldSet>

            <button type="button" className="cta" disabled={!canSubmit} onClick={handleSubmit}>Start Game</button>
        </div>
    </dialog>);
}

export default GameSettingsModal;