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

    //console.log('user can see board',userCanSeeGameBoard);

    return (<div className="MainView">
        
        {userCanSeeGameBoard() ? <GameBoard /> : <SignIn />}

    </div>);
}

export default MainView;