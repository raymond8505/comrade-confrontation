import React,{useContext,useReducer,useRef} from "react";
import logo from '../img/logo.png';
import {GameContext} from '../contexts/gameContext';
import Alert from "./Alert";

const SignIn = ({}) => {

    const hostNameField = useRef(null);

    const gameCodeField = useRef(null);

    const {createGame,joinGame,alerts,setAlerts,createAlert} = useContext(GameContext);

    const handleEmptyNameField = () => {
        setAlerts([createAlert('Please enter your name','error')]);
        hostNameField.current.focus();
    }

    const handleCreateGame = e => {

        console.log('creating game');

        if(hostNameField.current.value === '')
        {
            handleEmptyNameField();
        }
        else
        {
            createGame(hostNameField.current.value);
        }
    }

    const handleJoinGame = e => {

        if(hostNameField.current.value === '')
        {
            handleEmptyNameField();
        }
        else
        {
            joinGame(gameCodeField.current.value.toUpperCase(),
                    null,
                    hostNameField.current.value);
        }
    }

    

    return (<div className="SignIn">
        <div className="SignIn__inner">
            <img src={logo} alt="Comrade Confrontation" className="SignIn__logo" />

            <div className="SignIn__form">
                
                <input type="text" 
                        placeholder="Your Name" 
                        ref={hostNameField}
                        defaultValue="player 1" />
                <button type="button" 
                        className="cta" 
                        onClick={handleCreateGame}>Host Game</button>

                <input type="text" 
                        placeholder="Game Code, ex: SPQR" 
                        ref={gameCodeField}
                        className="Alert__code-field"
                        defaultValue="AOLJ" />
                <button type="button" 
                        className="cta" 
                        onClick={handleJoinGame}>Join Game</button>
                
            </div>

            {alerts.length > 0 ? alerts.map((a,i)=><Alert alert={a} key={i} />) : null}
        </div>
    </div>);
}

export default SignIn;