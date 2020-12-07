import React,{useEffect,useRef,useContext} from "react";
import { GameContext } from "../contexts/gameContext";

const SoundPlayer = ({soundPath}) => {

    const player = useRef(null);

    const {currentSound,setCurrentSound} = useContext(GameContext);

    //console.log(currentSound);

    const handlePlayerLoad = e => {
        
        e.target.play();
    }

    const handlePlayerComplete = e => {

        console.log('play complete');
        setCurrentSound(undefined);
    }

    useEffect(()=>{

        player.current.addEventListener('canplay',handlePlayerLoad);
        player.current.addEventListener('ended',handlePlayerComplete);
        return ()=>{}
        
    },[]);

    return (<audio className="SoundPlayer" 
                    src={currentSound !== undefined ? currentSound : null}
                    ref={player}>
    </audio>);
}

export default SoundPlayer;