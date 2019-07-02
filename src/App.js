import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar/NavBar';
import Exercises from './Exercises/Exercises';
import Routine from './Routines/Routine'
import {Route} from 'react-router-dom';
import Callback from './Callback';
import SecuredRoute from './SecuredRoute';

class App extends Component {
  render() {
    return (
      <div>
        <Route path='/' component={NavBar}/>
        <Route exact path='/' component={Exercises}/>
        <Route exact path='/callback' component={Callback}/>
        <Route path='/exercises/:id' component={Routine}/>
      </div>
    );
  }
}

export default App;
