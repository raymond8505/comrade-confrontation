import React,{useContext,useRef,useEffect, useState} from "react";
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
            currentUserInGame,
            getLocalCredentials,
            getURLParams
        } = useContext(GameContext);
    
    const [gameCodeEntered,setGameCodeEntered] = useState(false);

    useEffect(()=>{

        console.log(gameCodeField.current.value);
        setGameCodeEntered(gameCodeField.current.value !== '');

        return ()=>{};
    },[gameCodeField.current]);

    useEffect(()=>{

        const urlParams = getURLParams();
        
        if(urlParams.code !== undefined)
        {
            gameCodeField.current.value = urlParams.code;
            hostNameField.current.focus();
            
        }

        //we're using setTImeout here to wait a second for the
        //socket. TODO: do this the right way
        
    },[]);

    useEffect(()=>{

        const localCreds = getLocalCredentials();

        if(gameState.socket !== null)
        {
            console.log(localCreds);

            if(localCreds !== null)
            {
                if(localCreds.gameID !== undefined &&
                    localCreds.userID !== undefined)
                    {
                        joinGame(localCreds.gameID,localCreds.userID);
                    }
            }
        }
        
        
    },[gameState.socket]);

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

    

    const onCodeFieldChange = e => {

        setGameCodeEntered(e.target.value !== '');
    }

    const creds = getLocalCredentials();
    const name = creds === null ? '' : creds.name

    return (<div className="SignIn">
        <div className="SignIn__inner">
            <img src={logo} alt="Comrade Confrontation" className="SignIn__logo" />

            <div className="SignIn__form">
                
                <input type="text" 
                        placeholder="Your Name"
                        ref={hostNameField}
                        disabled={showTeamPicker}
                        defaultValue={name} />
                <button type="button" 
                        className="cta" 
                        onClick={handleCreateGame}
                        disabled={showTeamPicker || gameCodeEntered}>Host Game</button>

                <input type="text" 
                        placeholder="Game Code, ex: USSR" 
                        ref={gameCodeField}
                        className="Alert__code-field"
                        //defaultValue="MSGJ"
                        disabled={showTeamPicker}
                        onChange={onCodeFieldChange} />
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