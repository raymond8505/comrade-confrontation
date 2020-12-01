import React,{useContext,useEffect} from "react";
import {GameContext} from '../contexts/gameContext';
import SignIn from "./SignIn";
import GameBoard from './GameBoard';

const MainView = ({}) => {

    const {gameState,
            gameIsRunning,
            getLocalCredentials,
            joinGame} = useContext(GameContext);

    useEffect(()=>{
        if(!gameIsRunning)
        {
            const localCreds = getLocalCredentials();

            if(localCreds)
            {
                joinGame(localCreds.gameID,localCreds.userID);
            }
        }

        return ()=>{}
    },[]);

    //console.log(gameState);

    return (<div className="MainView">
        
        {gameIsRunning ? <GameBoard /> : <SignIn />}

    </div>);
}

export default MainView;