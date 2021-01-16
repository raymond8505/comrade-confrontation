import React from "react";
import Modal from "./Modal";
import Fieldset from "./FieldSet";
import ToolTip from 'react-simple-tooltip';
import FieldSet from "./FieldSet";
import config from '../config.json';

const FastMoneyInstructionsModal = ({}) => {

    return (<div className="FastMoneyInstructionsModal">
        <Modal 
            buttonText="Help" 
            title="Rapid Rubles Host Tips and Instructions"
            theme="black-and-white"
        >
            <FieldSet legend="Timers">
                <dl>
                    <dt>First Timer:</dt>
                    <dd>{config.FAST_MONEY.TIMERS[0]}s</dd>
                    <dt>Second Timer:</dt>
                    <dd>{config.FAST_MONEY.TIMERS[1]}s</dd>
                </dl>
            </FieldSet>
            <Fieldset legend="Instructions">

                <h3>The Questions Round</h3>

                <p>Once you start the round by clicking the button on the right,
                your cursor will move to the first answer field and the timer will begin.</p>

                <p>
                As your player answers your questions you can type their answers in the answer
                fields then press enter, tab or the down arrow to move to the next answer field. The 
                question will change based on which answer field you have highlighted.
                </p>

                <h3>Tabulating Scores</h3>
                <p>
                    <strong>If the player finishes answering before the timer runs out, press Stop Round</strong>. 
                    This will enable the points fields and display the question answers for reference.
                </p>
                <p>
                    Once the player has gone through all 5 questions, or their timer has expired,
                    begin tabulating their scores.
                </p>
                <p>
                    When you select an answer field, that question's answers will appear on the left
                    hand side of the screen for reference. If you click an answer in the answers table,
                    its score will populate the answer's points field. If the player didn't guess one of the 
                    answers, give them zero for that question.
                </p>
                <p>
                    Once you've entered all points, click <strong>Submit</strong> to register the player's answers and 
                    show all players the total score, but not the individual answers.
                </p>
                <p>
                    <strong>Which timer is used depends on whether or not you've submitted the first player's answers</strong>
                </p>

                <h3>Revealing answers and scores to the players</h3>
                
                
                <div>Click the yellow eye icon (<ToolTip content={`"eyecon" Get it?`} customCss={{'textAlign':'center'}}><i className="fas fa-eye"></i></ToolTip>) 
                beside each answer to reveal it and its points to the players.</div>

                <p>Repeat with the second player.</p>
                
            </Fieldset>
            <Fieldset legend="Keyboard Controls">
                <dl>
                    <dt>Enter / Down</dt>
                    <dd>Move to the next answer</dd>
                    <dt>Up</dt>
                    <dd>Move to the previous answer</dd>
                    <dt>ESC</dt>
                    <dd>Sound the 'wrong' buzzer for use with duplicate answers on the second
                        player
                    </dd>
                </dl>
            </Fieldset>
        </Modal>
    </div>);
}

export default FastMoneyInstructionsModal;