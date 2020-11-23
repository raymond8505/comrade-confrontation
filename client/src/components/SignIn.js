import React,{useContext,useRef} from "react";
import logo from '../img/logo.png';
import {GameContext} from '../contexts/gameContext';

const SignIn = ({}) => {

    const hostNameField = useRef(null);

    const {createGame,joinGame} = useContext(GameContext);

    const handleCreateGame = e => {
        createGame(hostNameField.current.value);
    }

    return (<div className="SignIn">
        <div className="SignIn__inner">
            <img src={logo} alt="Comrade Confrontation" className="SignIn__logo" />

            <div className="SignIn__form">
                
                <input type="text" placeholder="Your Name" ref={hostNameField} />
                <button type="button" className="cta" onClick={handleCreateGame}>Host Game</button>

                <input type="text" placeholder="Game Code, ex: SPQR" />
                <button type="button" className="cta">Join Game</button>
                
            </div>
        </div>
    </div>);
}

export default SignIn;