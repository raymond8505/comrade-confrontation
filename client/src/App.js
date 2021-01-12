import React, { useContext } from 'react';
import {GameContext,GameController} from './contexts/gameContext';
import MainView from './components/MainView';
import './css/App.scss';
import {InMemoryCache,HttpLink,ApolloProvider} from '@apollo/client';
import {ApolloClient} from 'apollo-client';

const client = new ApolloClient({
  link : new HttpLink({
    uri : 'http://162.252.83.130:4000/graphql'
    //uri : window.location.host.indexOf('localhost') !== -1 ? 'http://localhost:4000/graphql' : 'http://162.252.83.130:4000/graphql',
  }),
  cache : new InMemoryCache()
});

function App() {

  return (
    <ApolloProvider client={client}>
      <GameContext.Provider value={GameController()}>
        <div className="App">
          <MainView />
        </div>
      </GameContext.Provider>
    </ApolloProvider>
  );
}

export default App;
