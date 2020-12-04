import React,{useContext,useEffect} from "react";
import {GameContext} from '../contexts/gameContext';
import logo from '../img/logo.png';
import PlayerList from "./PlayerList";
import QuestionBoard from "./QuestionBoard";
import QuestionPicker from "./QuestionPicker";
import TeamStats from "./TeamStats";

const GameBoard = ({}) => {

    const {gameState,
            getUserInfo,
            getCurrentRound,
            currentUserIsHost} = useContext(GameContext);

    return (<div className="GameBoard">

        <div className="GameBoard__row GameBoard__row--top">
            <div className="GameBoard__team-1">
            <TeamStats 
                team={gameState.teams[0]}
                enableDot = {gameState.activeTeam === 0} 
            />

            <PlayerList players={getUserInfo(gameState.teams[0].players)} />
            </div>
            <div className="GameBoard__game-stats">
                <img src={logo} alt="Comrade Confrontation" className="GameBoard__logo" />
                <div className="GameBoard__game-code">
                    {gameState.ID}
                </div>
                <div className="GameBoard__round-number">
                    {gameState.currentRound}
                </div>

                {gameState.currentRound > 0 ? 
                    <QuestionBoard question={getCurrentRound().question} /> : null}
            </div>

            <div className="GameBoard__team-2">
                <TeamStats 
                    team={gameState.teams[1]} 
                    enableDot={gameState.activeTeam === 1} 
                />

                <PlayerList players={getUserInfo(gameState.teams[1].players)} />
            </div>
        </div>
        
        {gameState.rounds.length === 0 ? <QuestionPicker /> : null}
        
    </div>);
}

export default GameBoard;