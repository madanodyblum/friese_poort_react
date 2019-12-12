import React, {Component} from 'react'
import { trls } from './translate';
import  { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({

});
class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    changeItem = () => {
        this.setState({flag:1})
    }
    render () {
      return (
            <aside className="sidebar">
                <a href="/" className="sidebar__logo"><img src={require('../assets/images/imgpsh_fullsize_anim.png')} style={{height:"125px", width:"125px"}} alt="appzmakerz"></img></a>
                <nav className="menu">
                    <ul className="menu__list">
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/dashboard'} className={window.location.pathname === "/dashboard" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <i className="fas fa-home menu__link-img-wrap"></i>
                                <span>{trls("Dashboard")}</span>
                            </Link>
                        </li>
                        <li className="menu__separator"></li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/user'} className={window.location.pathname === "/user" || window.location.pathname === "/user-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <i className="fas fa-user menu__link-img-wrap"></i>
                                <span>{trls("User")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/tasks'} className={window.location.pathname === "/tasks" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <i className="fas fa-envelope-open menu__link-img-wrap"></i>
                                <span>{trls("Tasks")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/customer'} className={window.location.pathname === "/customer" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <i className="fas fa-users menu__link-img-wrap"></i>
                                <span>{trls("Customer")}</span>
                            </Link>
                        </li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/visit-report'} className={window.location.pathname === "/visit-report"  ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <i className="fas fa-file menu__link-img-wrap"></i>
                                <span>{trls("Visit_report")}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
