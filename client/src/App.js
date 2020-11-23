import React, { useContext } from 'react';
import {GameContext,GameController} from './contexts/gameContext';
import MainView from './components/MainView';
import './css/App.scss';

function App() {

  return (
    <GameContext.Provider value={GameController()}>
      <div className="App">
        <MainView />
      </div>
    </GameContext.Provider>
  );
}

export default App;
