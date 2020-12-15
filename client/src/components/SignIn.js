import React,{useContext,useRef,useEffect} from "react";
import logo from '../img/logo.png';
import {GameContext} from '../contexts/gameContext';
import Alert from "./Alert";
import TeamPicker from "./TeamPicker";

const SignIn = ({}) => {

    const hostNameField = useRef(null);

    const gameCodeField = useRef(null);

    const {createGame,
            joinGame,
            setAlerts,
            createAlert,
            gameState,
            currentUserHasTeam,
            currentUserInGame
        } = useContext(GameContext);

    const showTeamPicker = currentUserInGame() && !currentUserHasTeam();

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
                        disabled={showTeamPicker} />
                <button type="button" 
                        className="cta" 
                        onClick={handleCreateGame}
                        disabled={showTeamPicker}>Host Game</button>

                <input type="text" 
                        placeholder="Game Code, ex: USSR" 
                        ref={gameCodeField}
                        className="Alert__code-field"
                        //defaultValue="MSGJ"
                        disabled={showTeamPicker} />
                <button type="button" 
                        className="cta" 
                        onClick={handleJoinGame}
                        disabled={showTeamPicker}>Join Game</button>
                
                {showTeamPicker ? <TeamPicker /> : null}
                
            </div>

            {gameState.alerts.length > 0 ? gameState.alerts.map((a,i)=><Alert alert={a} key={i} />) : null}
        </div>
    </div>);
}

export default SignIn;