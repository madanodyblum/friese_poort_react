import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Dashboard from '../pages/Dashboard/dashboard.js'
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';
import '../assets/css/datatable.css';
window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%"}}>
            <Sidebar/>
            <Col style={{paddingLeft:0, paddingRight:0}}>
             <Header/>
                <Router history={history}>
                  <Switch>
                    <Route path="/dashboard" component={Dashboard}/>
                    {/* <Route path="/user" component={User}/> */}
                  </Switch>
                </Router>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
