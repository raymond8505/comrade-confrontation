import React,{useContext,useEffect} from "react";
import {GameContext} from '../contexts/gameContext';
import logo from '../img/logo.png';
import PlayerList from "./PlayerList";
import QuestionBoard from "./QuestionBoard";
import QuestionPicker from "./QuestionPicker";
import StrikeBoxes from "./StrikeBoxes";
import TeamStats from "./TeamStats";
import SoundPlayer from './SoundPlayer';
import PassOrPlay from './PassOrPlay';

const GameBoard = ({}) => {
    
    const {gameState,
            getUserInfo,
            getCurrentRound,
            currentUserIsHost,
            currentUserHasTeam,
            clearLocalCredentials,
            currentUserCanBuzz,
            sendBuzz,
            currentSound,
            getCurrentRoundStage,
            gameHasRounds} = useContext(GameContext);
    
    const {game} = gameState;

    const currentUser = gameState.user;
    
    const handleLogout = e => {

        clearLocalCredentials();
        window.location.reload();
    }

    //console.log(getCurrentRound(),game.rounds[game.currentRound]);

    /**
     * tags on which handleKeys should ignore key events 
     */
    const keyHandlerExceptions = ['input','textarea'];
    
    const handleKeys = e => {

        if(keyHandlerExceptions.includes(e.target.tagName.toLowerCase())) return;

        e.preventDefault();
        e.stopPropagation();

        switch(e.which)
        {
            case 32: //space, head to head buzzer

            if(currentUserCanBuzz)
            {

                sendBuzz(game.ID,currentUser.ID);
            }
        }
    }

    useEffect(()=>{
        window.addEventListener('keyup',handleKeys);

        return ()=>{
            window.removeEventListener('keyup',handleKeys);
        }

    },[gameState.game]);

    return (<div 
        className={`GameBoard${currentUserIsHost ? ' GameBoard--host' : ''}
        ${getCurrentRound() !== undefined && getCurrentRound().started ? ' GameBoard--round-started' : ''}`}>

            <SoundPlayer sound={currentSound} />
        <div className="GameBoard__row GameBoard__row--top">
            <div className="GameBoard__team-1">
            <TeamStats 
                team={game.teams[0]}
                enableDot = {game.activeTeam === 0} 
            />

            
            </div>
            <div className="GameBoard__game-stats">
                <div className="GameBoard__top-controls">
                    
                    {gameHasRounds ? <span className="GameBoard__game-code">{game.ID}</span> : null}
                    
                    <button 
                        type="button" 
                        className="GameBoard__logout-btn"
                        onClick={handleLogout}
                    >Logout</button>
                </div>
                <img src={logo} alt="Comrade Confrontation" className="GameBoard__logo" />
                
                <div className="GameBoard__round-info">

                    <div className="GameBoard__round-number">
                        {getCurrentRound() !== undefined ? getCurrentRound().number : ''}
                    </div>
                </div>

                
            </div>

            <div className="GameBoard__team-2">
                <TeamStats 
                    team={game.teams[1]} 
                    enableDot={game.activeTeam === 1} 
                />

                
            </div>
        </div>

        <div className="GameBoard__row">
            <PlayerList players={getUserInfo(game.teams[0].players)} />

            {gameHasRounds ? (<div className="GameBoard__questions-wrapper">
                    <QuestionBoard question={getCurrentRound().question} />
                    <StrikeBoxes strikes={getCurrentRound().strikes} />
                </div>) : null}

            <PlayerList players={getUserInfo(game.teams[1].players)} />
        </div>
        
        {game.rounds.length === 0 && currentUserIsHost() ? <QuestionPicker /> : null}
        {game.rounds.length > 0 && game.activeTeam === -1 && getCurrentRoundStage() === 2 ? <PassOrPlay round={game.currentRound} /> : null}
        
    </div>);
}

export default GameBoard;