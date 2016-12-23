import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import RootApp from './modules/root';
import ProposalViewer from './modules/proposal';
import OntLookup from './modules/ontlookup';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import './css/index.css';

ReactDOM.render((
  <Router history={hashHistory}>
    {/* add the routes here */}
    <Route path="/" component={RootApp}>
        <Route path="/proposals" component={ProposalViewer}/>
        <Route path="/lookup" component={OntLookup}/>
    </Route>
  </Router>
), document.getElementById('root'))