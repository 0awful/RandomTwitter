import React from 'react';
import logo from './logo.svg';

import { TwitterTimelineEmbed } from 'react-twitter-embed';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="realDonaldTrump"
        options={{ height: 400 }}
      />
    </div>
  );
};

export default App;
