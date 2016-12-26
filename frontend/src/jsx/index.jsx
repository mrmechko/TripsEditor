import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import RootApp from './modules/root';
import ProposalViewer from './modules/proposal';
import Lookup from './modules/ontlookup';
import LoginView from './modules/login';


import 'react-mdl/extra/material.js';

ReactDOM.render((
  <Router history={hashHistory}>
    {/* add the routes here */}
    <Route path="/" component={RootApp}>
        <Route path="/proposals" component={ProposalViewer}/>
        <Route path="/lookup" component={Lookup}/>
        <Route path="/login" component={LoginView}/>
    </Route>
  </Router>
), document.getElementById('root'))
