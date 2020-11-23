import React,{useContext} from "react";
import {GameContext} from '../contexts/gameContext';
import logo from '../img/logo.png';
import TeatStats from "./TeamStats";

const GameBoard = ({}) => {

    const {gameState,getTeamName} = useContext(GameContext);

    return (<div className="GameBoard">

        <div className="GameBoard__row GameBoard__row--top">
            <TeatStats 
                team={gameState.teams[0]}
                enableDot = {gameState.activeTeam === 0} 
            />

            <div className="GameBoard__game-stats">
                <img src={logo} alt="Comrade Confrontation" className="GameBoard__logo" />
                <div className="GameBoard__game-code">
                    {gameState.ID}
                </div>
                <div className="GameBoard__round-number">
                    {gameState.currentRound}
                </div>
                <div className="GameBoard__round-status-and-controls">
                    menu - wrongs - mark wrong
                </div>
            </div>

            <TeatStats 
                team={gameState.teams[1]} 
                enableDot={gameState.activeTeam === 1} 
            />
        </div>
        
        
    </div>);
}

export default GameBoard;