import React, {Component} from 'react'
import { Form,Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Userform from './user_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import Sweetalert from 'sweetalert'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Usermanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            userData:[],
            roleData: [],
            userId: '',
            flag:'',
            userUpdateData:[],
            loading:true
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getUserData();
        this.getRoleData();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getUserData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.BaseUrl+'api/users/GetUsers?excludeActiveUsers=false', headers)
        .then(result => {
            if(this._isMounted){
                this.setState({userData:result.data})
                this.setState({loading:false})
                $('#user_table').dataTable().fnDestroy();
                $('#user_table').DataTable(
                    {
                      "language": {
                          "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                          "zeroRecords": "Nothing found - sorry",
                          "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                          "infoEmpty": "No records available",
                          "infoFiltered": "(filtered from _MAX_ total records)",
                          "search": trls('Search'),
                          "paginate": {
                            "previous": trls('Previous'),
                            "next": trls('Next')
                          }
                      }
                    }
                  );
            }
        });
    }

    getRoleData = () => {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.BaseUrl+'api/Roles', headers)
        .then(result => {
            if(this._isMounted){
                this.setState({roleData: result.data})
            }
        });
    }

    userUpdate = (userData) => {
        let roleData = {'value': userData.RoleId, 'label': userData.RoleName}
        userData.RoleData = roleData
        this.setState({userUpdateData: userData, mode: 'update', modalShow: true})
    }

    viewUserData = (userData) => {
        let roleData = {'value': userData.RoleId, 'label': userData.RoleName}
        userData.RoleData = roleData
        this.setState({userUpdateData: userData, mode: 'view', modalShow: true})
    }

    userDelete = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.delete("https://cors-anywhere.herokuapp.com/"+API.BaseUrl+'api/Users/'+this.state.userId, headers)
        .then(result => {
            Sweetalert("Success!"+trls('The_user_has_been_deleted'), {
                icon: "success",
            });
            this.getUserData();               
        });
    }

    userDeleteConfirm = (userId) => {
        this.setState({userId:userId})
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.userDelete();
                
            } else {
                
            }
          });
    }

    removeUpdateData = () => {
        this.props.blankdispatch()
        this.setState({userUpdateData: []});
    }
    render () {
        let userData=this.state.userData;
        let optionarray = [];
        if(userData){
            userData.map((data, index) => {
                if(data.IsActive){
                    optionarray.push(data);
                }
              return userData;
            })
        }
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('User')}</h2>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form inline style={{width:"100%"}}>
                            <Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}><i className="fas fa-user-plus" style={{paddingRight:5}}></i>{trls('Add_User')}</Button> 
                            <Userform
                                show={this.state.modalShow}
                                mode={this.state.mode}
                                onHide={() => this.setState({modalShow: false})}
                                roleData={this.state.roleData}
                                onGetUser={() => this.getUserData()}
                                userUpdateData={this.state.userUpdateData}
                                removeUpdateData={()=>this.removeUpdateData()}
                            />  
                        </Form>
                    </div>
                    <div className="table-responsive">
                        <table id="user_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('UserName')}</th>
                                <th>{trls('Email')}</th>
                                <th>{trls('Active')}</th>
                                <th style={{width:100}}>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {optionarray && !this.state.loading &&(<tbody >
                            {
                                optionarray.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.UserName}</td>
                                        <td>{data.Email}</td>
                                        {data.IsActive?(
                                            <td>
                                                <Row style={{justifyContent:"center"}}>
                                                <i className="fas fa-circle active-icon"></i><div>Active</div>
                                                </Row>
                                            </td>
                                        ):
                                            <td >
                                                <Row style={{justifyContent:"center"}}>
                                                <i className="fas fa-circle inactive-icon"></i><div>Inactive</div>
                                                </Row>
                                            </td>
                                        }
                                        <td >
                                            <Row style={{justifyContent:"space-around", padding:10}}>
                                                <i id={data.Id} className="fas fa-trash-alt action-icon" style={{color: '#DF3535'}} onClick={()=>this.userDeleteConfirm(data.Id)}></i>
                                                <i id={data.Id} className="fas fa-edit action-icon" style={{color: '#0D57AA'}} onClick={()=>this.userUpdate(data)}></i>
                                                <i id={data.Id} className="fas fa-eye action-icon" style={{color: '#12D155'}} onClick={()=>this.viewUserData(data)}></i>
                                            </Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)}
                    </table>
                        { this.state.loading&& (
                            <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                <BallBeat
                                    color={'#222A42'}
                                    loading={this.state.loading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Usermanage);
