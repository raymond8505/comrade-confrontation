import React,{useContext,useEffect} from "react";
import {GameContext} from '../contexts/gameContext';
import SignIn from "./SignIn";
import GameBoard from './GameBoard';

const MainView = ({}) => {

    const {gameState,
            gameIsRunning,
            getLocalCredentials,
            joinGame,
            userCanSeeGameBoard} = useContext(GameContext);

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
    },[gameState]);

    return (<div className="MainView">
        
        {userCanSeeGameBoard ? <GameBoard /> : <SignIn />}

    </div>);
}

export default MainView;