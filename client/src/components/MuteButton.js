import React,{useContext} from "react";
import {GameContext} from '../contexts/gameContext';

const MuteButton = ({}) => {

    const {muted,setMuted} = useContext(GameContext);

    return (<button className="MuteButton" onClick={e=>setMuted(!muted)}>
        <span className={`fas fa-volume-${muted ? 'mute' : 'up'}`}></span>
    </button>);
}

export default MuteButton;