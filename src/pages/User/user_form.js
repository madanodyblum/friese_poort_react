import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Select from 'react-select';
// import PhoneInput from 'react-phone-number-input'
// import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ListErrors from '../../components/listerrors';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
              dispatch(authAction.dataServerFail(params)),
});

class Userform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            val1: ''
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
    }

    handleSubmit = (event) => {
        var params = [];
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        
        var headers = SessionManager.shared().getAuthorizationHeader();
        if(this.props.mode==="add"){
            params = {
                "Email": data.email,
                "PhoneNumber": this.state.phonevalue,
                "password": data.password,
                "confirmPassword": data.conrirmpassword,
                "RoleName": data.role,
            }
            Axios.post(API.BaseUrl+'api/Users', params, headers)
            .then(result => {
                this.onHide();
                this.props.onGetUser() ;
            })
            .catch(err => {
                if(err.response){
                    if(err.response.data.ModelState[""]){
                        this.props.postUserError(err.response.data.ModelState[""])
                    }else if(err.response.data.ModelState["model.Password"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                        this.props.postUserError(err.response.data.ModelState["model.Password"])
                    }else if(err.response.data.ModelState["model.ConfirmPassword"])
                        this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
                }
                
            });
        }else{
            params = {
                "Id": this.props.userUpdateData.Id,
                "PhoneNumber": this.state.phonevalue ? this.state.phonevalue : this.props.userUpdateData.PhoneNumber,
                "RoleName": data.role,
            }
            Axios.put("https://cors-anywhere.herokuapp.com/"+API.BaseUrl+'api/Users', params, headers)
            .then(result => {
                this.onHide();
                this.props.onGetUser() ;
            })
            .catch(err => {
                if(err.response.data.ModelState[""]){
                    this.props.postUserError(err.response.data.ModelState[""])
                }else if(err.response.data.ModelState["model.Password"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                    this.props.postUserError(err.response.data.ModelState["model.Password"])
                }else if(err.response.data.ModelState["model.ConfirmPassword"])
                    this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
            });
        }
        
    }

    onHide = () => {
        this.props.onHide();
        this.setState({phonevalue: ''})
        this.props.removeUpdateData()
    }
    
    render(){
        let updatePhoneNumber = '';
        let roleData = this.props.roleData.map( s => ({value:s.Name,label:s.Name}));
        let updateData = this.props.userUpdateData;
        if(this.props.userUpdateData.PhoneNumber){
            updatePhoneNumber = this.props.userUpdateData.PhoneNumber;
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {this.props.mode==="add"&&(trls('New_user'))}
                    {this.props.mode==="update"&&(trls('Edit_user'))}
                    {this.props.mode==="view"&&(trls('View_user'))}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    {this.props.mode==="add"&&(
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('Email')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="email" name="email" className="input-text" defaultValue={updateData.Email} required placeholder={trls('Email')} />
                            </Col>
                        </Form.Group>
                    )}
                    {this.props.mode==="view"&&(
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('Email')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="email" name="email" className="input-text" disabled defaultValue={updateData.Email} required placeholder={trls('Email')} />
                            </Col>
                        </Form.Group>
                    )}
                    {this.props.mode!=="view"?(
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                                {trls('PhoneNumber')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <PhoneInput
                                    country = 'nl'
                                    placeholder="Enter mobile number"
                                    value={ this.state.phonevalue ? this.state.phonevalue : updatePhoneNumber }
                                    name="phonenumber"
                                    onChange={ value => this.setState({phonevalue: value })}
                                />
                            </Col>
                        </Form.Group>
                    ):
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('PhoneNumber')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="text" name="phone" className="input-text" disabled defaultValue={updatePhoneNumber} required placeholder={trls('PhoneNumber')} />
                            </Col>
                        </Form.Group>
                    }
                    
                    {this.props.mode==="add"&&(
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('Password')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="password" name="password" className="input-text" required placeholder={trls('Password')} />
                            </Col>
                        </Form.Group>
                    )}
                    {this.props.mode==="add"&&(
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('ConfirmPassword')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="password" name="conrirmpassword" className="input-text" required placeholder={trls('ConfirmPassword')} />
                            </Col>
                        </Form.Group>
                    )}
                    {this.props.mode!=="view"?(
                        <Form.Group as={Row} controlId="password">
                            <Form.Label column sm="3">
                            {trls('Role')}   
                            </Form.Label>
                            <Col sm="9" className="product-text" style={{height:"auto"}}>
                                <Select
                                    name="role"
                                    options={roleData}
                                    placeholder={trls('Select')}
                                    onChange={val => this.setState({val1:val})}
                                    defaultValue = {updateData.RoleData}
                                />
                                {!this.props.disabled && this.props.mode==="add" && (
                                    <input
                                        onChange={val=>console.log()}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        style={{ opacity:0, height: 0, width: "100%"}}
                                        value={this.state.val1}
                                        required
                                    />
                                )}
                            </Col>
                        </Form.Group>
                    ):
                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm="3">
                            {trls('Role')}   
                            </Form.Label>
                            <Col sm="9" className="product-text input-div">
                                <Form.Control type="text" name="role" className="input-text" disabled defaultValue={updateData.RoleName} required placeholder={trls('Role')} />
                            </Col>
                        </Form.Group>
                    }
                    <ListErrors errors={this.props.error}/>
                    {this.props.mode!=="view"&&(
                        <Form.Group style={{textAlign:"center"}}>
                            <Button type="submit" variant="primary" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Userform);