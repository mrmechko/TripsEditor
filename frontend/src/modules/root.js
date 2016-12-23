import React, { Component } from 'react';
import { Link } from 'react-router';
import {Grid, Cell, Layout, Header, Navigation, Drawer, Content} from 'react-mdl';


import '../css/App.css';



class RootApp extends Component {
    render() {
        return (
        <div>
            <Layout>
                <Header title="Trips Tools" style={{color: 'white'}}>
                    <Navigation>
                        <Link to="/proposals">Proposals</Link>
                        <Link to="/lookup">Lookup</Link>
                    </Navigation>
                </Header>
                <Drawer title="Menu">
                    <Navigation>
                        <Link to="/login">Login</Link>
                    </Navigation>
                </Drawer>
                <Content>
                    <Grid>
                        <Cell col={2}>
                        </Cell>
                        <Cell col={8}>
                            {this.props.children}
                        </Cell>
                        <Cell col={2}>
                        </Cell>
                    </Grid>
                </Content>
            </Layout>
        </div>)
    }
}

export default RootApp;