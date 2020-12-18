import React,{useEffect,useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const SoundPlayer = () => {

    const player = useRef(null);

    const {gameState,clearCurrentSound,muted} = useContext(GameContext);

    const {currentSound} = gameState;

    //console.log(currentSound);

    const handlePlayerLoad = e => {
        
        e.target.play();
    }

    const handlePlayerComplete = e => {

        console.log('play complete');
        clearCurrentSound();
    }

    useEffect(()=>{

        if(player != null && player.current !== null)
        {
            player.current.addEventListener('canplay',handlePlayerLoad);
            player.current.addEventListener('ended',handlePlayerComplete);
        }
        
        return ()=>{

            if(player != null && player.current !== null)
            {
                player.current.addEventListener('canplay',handlePlayerLoad);
                player.current.addEventListener('ended',handlePlayerComplete);
            }
        }
        
    },[]);

    return (<audio className="SoundPlayer" 
                    src={currentSound !== undefined ? currentSound : null}
                    ref={player}
                    muted={muted}>
    </audio>);
}

export default SoundPlayer;