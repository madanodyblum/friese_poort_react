import React, {Component} from 'react'
import { connect } from 'react-redux';
import { trls } from '../../components/translate';
import { Container, Button } from 'react-bootstrap';
import Addnumberform from './addnumber_form';
import $ from 'jquery';
import * as authAction  from '../../actions/authAction';
import { BallBeat } from 'react-pure-loaders';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import 'datatables.net';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Dashboard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            number: [],
            loading: true
        };
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getRegistrationNumbers();
    }

    getRegistrationNumbers = () =>{
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUrl+'getRegistrationNumbers', headers)
        .then(result => {
            this.setState({loading:false})
            this.setState({number: result.data.Items});
            $('#number_table').dataTable().fnDestroy();
            $('#number_table').DataTable(
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
        })  
    }
    
    render(){   
        let number = [];
        number = this.state.number;
        return (
            <Container>
                <div className="dashboard-header content__header content__header--with-line">
                    <h2 className="title">{trls('Dashboard')}</h2>
                </div>
                 <div className="orders">
                    <div className="orders__filters justify-content-between">
                    <Button variant="primary" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_RegistNumber')}</Button> 
                        <Addnumberform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            // artikelenData={this.state.artikelenData}
                            onGetNumberData={()=>this.getRegistrationNumbers()}
                        /> 
                        <div className="table-responsive table-pagination">
                            <table id="number_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('ParticipantNumber')}</th>
                                    <th>{trls('CommitmentNumber')}</th>
                                </tr>
                            </thead>
                            {number && !this.state.loading &&(<tbody >
                                {
                                    number.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.DeelnemerNummer}</td>
                                            <td>{data.VerbintenisNummer}</td>
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
                </div>
            </Container>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);