import React, { Component } from 'react';
import axios from 'axios';

import { Textfield, Button } from 'react-mdl';

import DjangoCSRFToken from 'django-react-csrftoken';

class LoginView extends Component {
    render() {
        return (
          <div>
            <form action='/login/' method='post'>
              <DjangoCSRFToken/>
              <div>
                <Textfield name='username' label='username'></Textfield>
              </div>
              <div>
                <Textfield name='password' label='password'></Textfield>
              </div>
              <div>
                <Button raised colored type="submit">Login</Button>
              </div>
            </form>
          </div>
      )}
}

export default LoginView;
