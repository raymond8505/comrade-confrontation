import React,{useContext, useEffect,useState} from "react";
import { GameContext } from "../contexts/gameContext";

const BigStrikeBoxes = ({}) => {

    const {gameState,clearStrikesToShow} = useContext(GameContext);

    const {strikesToShow} = gameState;

    const [show,setShow] = useState(false);

    console.log(strikesToShow);

    useEffect(()=>{

        if(strikesToShow !== undefined && strikesToShow !== 0)
        {
            setTimeout(()=>{
                setShow(true);
        
                setTimeout(()=>{
                    clearStrikesToShow();
                    setShow(false);
                },700)
            },100);
        }
    },[strikesToShow])
    

    const renderBoxes = num => {

        const toRet = [];

        for(let i = 0; i < strikesToShow; i++)
        {
            toRet.push(<div key={`BigStrikeBox__box--${i}`} className={`StrikeBoxes__box${show ? ' StrikeBoxes__box--show' : ''}`}></div>);
        }

        return toRet;
    }

    return (<div className="BigStrikeBoxes">
        {renderBoxes()}
    </div>);
}

export default BigStrikeBoxes;