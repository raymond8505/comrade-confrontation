import React,{useContext, useEffect, useState} from "react";
import { GameContext } from "../contexts/gameContext";

const Timer = ({time}) => {

    const {playSound} = useContext(GameContext);
    const [currentTime,setCurrentTime] = useState(null);
    let timeout;

    useEffect(()=>{

        setCurrentTime(time);
        
    },[time]);

    useEffect(()=>{

        if(currentTime !== null)
        {
            if(currentTime > 0)
            {
                timeout = setTimeout(()=>{
                    setCurrentTime(currentTime - 1);
                },1000);
            }
            else
            {
                playSound('wrong');
            }
        }
        
        return ()=>{
            clearTimeout(timeout);
        }

    },[currentTime])

    return (<div className="Timer">
        <span className="Timer__time">{currentTime}</span>
    </div>);
}

export default Timer;