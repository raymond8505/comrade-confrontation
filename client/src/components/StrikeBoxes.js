import React,{useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const StrikeBoxes = ({strikes}) => {

    const {
        gameState,
        currentUserIsHost,
        registerStrike} = useContext(GameContext);

    const handleStrikeClick = e => {
        
        if(currentUserIsHost())
        {
            registerStrike();
        }

    }

    const renderBoxes = strikes => {

        const toRet = [];

        for(let s = 1; s <= 3; s++)
        {
            toRet.push(<li 
                            key={`strike-box_${s}`} 
                            className={`StrikeBoxes__box${s <= strikes ? ' StrikeBoxes__box--show' : ''}`}
                            onClick={handleStrikeClick}></li>);
        }

        return toRet;
    }
    return (<ul className="StrikeBoxes">
        
        {renderBoxes(strikes)}
    </ul>);
}

export default StrikeBoxes;