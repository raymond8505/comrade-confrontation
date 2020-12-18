import React,{useContext,useEffect,useState} from "react";
import {GameContext} from '../contexts/gameContext';
import logo from '../img/logo.png';
import PlayerList from "./PlayerList";
import QuestionBoard from "./QuestionBoard";
import QuestionPicker from "./QuestionPicker";
import StrikeBoxes from "./StrikeBoxes";
import Buzzer from "./Buzzer";
import TeamStats from "./TeamStats";
import SoundPlayer from './SoundPlayer';
import PassOrPlay from './PassOrPlay';
import BigStrikeBoxes from "./BigStrikeBoxes";
import FastMoneyBoard from './FastMoneyBoard';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import MuteButton from "./MuteButton";

const GameBoard = ({}) => {
    
    const {gameState,
            getUserInfo,
            getCurrentRound,
            currentUserIsHost,
            clearLocalCredentials,
            currentUserCanBuzz,
            sendBuzz,
            playSound,
            currentSound,
            getCurrentRoundStage,
            clearGameState,
            gameHasRounds} = useContext(GameContext);
    
    const {game} = gameState;

    const currentUser = gameState.user;

    const [codeCopied,setCodeCopied] = useState(false);

    useEffect(()=>{

        if(codeCopied)
        {
            setTimeout(()=>{
                setCodeCopied(false)
            },500);
        }

    },[codeCopied]);
    
    const handleLogout = e => {

        clearLocalCredentials();
        clearGameState();
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

            maybeBuzz();
        }
    }

    const maybeBuzz = () => {
        if(currentUserCanBuzz)
        {
            sendBuzz(game.ID,currentUser.ID);
        }
        else
        {
            playSound('wrong');
        }
    }

    const handleBuzzerClick = e => {
        maybeBuzz();
    }

    useEffect(()=>{
        window.addEventListener('keyup',handleKeys);

        return ()=>{
            window.removeEventListener('keyup',handleKeys);
        }

    },[gameState.game]);

    return (<div 
        className={`GameBoard${currentUserIsHost() ? ' GameBoard--host' : ''}` +
        `${getCurrentRound() !== undefined && getCurrentRound().started ? ' GameBoard--round-started' : ''}` +
        `${getCurrentRound() !== undefined && getCurrentRound().type === 'fast-money' ? ' GameBoard--fast-money' : ''}`
        }>

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
                    
                    {gameHasRounds ? <span className={`GameBoard__game-code${codeCopied ? ' GameBoard__game-code--copied' : ''}`}>
                        <CopyToClipboard text={`${window.location.host}?code=${game.ID}`} onCopy={()=>{
                            console.log('copied');

                            setCodeCopied(true);
                        }}>
                            <span>{game.ID}</span>
                        </CopyToClipboard>
                    </span> : null}
                    
                    <button 
                        type="button" 
                        className="GameBoard__logout-btn"
                        onClick={handleLogout}
                    >Logout</button>
                </div>
                <img src={logo} alt="Comrade Confrontation" className="GameBoard__logo" />
                
                <div className="GameBoard__round-info">

                    <div className="GameBoard__round-number">
                        {game.rounds.length > 0 && game.activeTeam === -1 && getCurrentRoundStage() === 2 ? <PassOrPlay round={game.currentRound} /> : (getCurrentRound() !== undefined ? getCurrentRound().number : '')}
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

            {gameHasRounds && getCurrentRound() != undefined ? (<div className="GameBoard__questions-wrapper">
                    {game.currentRound < 3 ? <QuestionBoard question={getCurrentRound().question} /> : <FastMoneyBoard questions={getCurrentRound().questions} />}
                    {game.currentRound < 3 ? <StrikeBoxes strikes={getCurrentRound().strikes} /> : null}
                </div>) : null}

            <PlayerList players={getUserInfo(game.teams[1].players)} />
        </div>
        
        {
            //show the question picker if we don't have any game rounds yet
            currentUserIsHost() && (game.rounds.length === 0 || 
            
            //or it's round 3 and the round hasn't been defined yet
            (game.currentRound === 3 && game.rounds[3] == undefined)) ? 

            <QuestionPicker numQuestions={game.currentRound === 3 ? 5 : 3} /> : null}
        
        <BigStrikeBoxes />
        {currentUserIsHost() ? null : <Buzzer onClick={handleBuzzerClick} />}
        <MuteButton />
    </div>);
}

export default GameBoard;