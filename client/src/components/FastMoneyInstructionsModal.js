import React from "react";
import Modal from "./Modal";
import Fieldset from "./FieldSet";
import ToolTip from 'react-simple-tooltip';

const FastMoneyInstructionsModal = ({}) => {

    return (<div className="FastMoneyInstructionsModal">
        <Modal 
            buttonText="Help" 
            title="Rapid Rubles Host Tips and Instructions"
            theme="black-and-white"
        >
            <Fieldset legend="Instructions">
                <p>Once you start the round by clicking the button on the right,
                your cursor will move to the first answer field and the timer will begin.</p>

                <p>
                As your player answers your questions you can type their answers in the answer
                fields then press enter, tab or the down arrow to move to the next answer field.
                </p>

                <p><strong>Don't pay attention to scores while the timer is running.</strong> After you've entered
                all the answers, you can go back and calculate the scores.</p>

                <p>Click <strong>Submit</strong> to register the player's answers and show the
                players the total score, but not the individual answers.</p>
                
                <div>Click the yellow eye icon (<ToolTip content={`"eyecon"`}><i className="fas fa-eye"></i></ToolTip>) 
                beside each answer to reveal it to the players.</div>

                <p>Repeat with the second player.</p>

                <h3>Tabulating Scores</h3>
                <p>
                    Once the player has gone through all 5 questions, or their timer has expired,
                    Begin tabulating their scores.
                </p>
                <p>
                    When you select an answer field, that question's answers will appear on the left
                    hand side of the screen for reference. If you click an answer in the answers table
                    its score will populate the answer's points field.
                </p>
                
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