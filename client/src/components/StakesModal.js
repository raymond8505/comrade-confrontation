import React,{useContext} from "react";
import { GameContext } from "../contexts/gameContext";
import FieldSet from "./FieldSet";
import config from '../config.json'

const StakesModal = ({}) => {

    const {gameState,getLeadingTeam} = useContext(GameContext);

    return (<dialog className="StakesModal modal">
        <div className="StakesModal__inner modal__inner">
            <h1 className="StakesModal__title">Rapid Rubles</h1>

            <FieldSet legend="Stakes" extraClasses={['StakesModal__stakes']}>
                {gameState.game.fastMoneyStakes}
            </FieldSet>

            <p className="StakesModal__instructions">
                <strong>{getLeadingTeam().name}</strong> moves on to Rapid Ruples. If they score <strong>200</strong> or more, 
                they decide which team the stakes apply to.<br /><br />
                While the host chooses questions, <strong>pick 2 players</strong> from your team to answer the questions. 
                The first player will have <strong>{config.FAST_MONEY.TIMERS[0]} seconds</strong> to answer <strong>5 questions</strong>.
                 The second player will have <strong>{config.FAST_MONEY.TIMERS[1]} seconds</strong> to answer the same 5 questions.<br /><br />
                <strong>For maximum fun, player 2 should avoid hearing player 1's answers.</strong>
            </p>
            
        </div>
    </dialog>);
}

export default StakesModal;