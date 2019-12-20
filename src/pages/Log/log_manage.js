import React, {Component} from 'react'
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
// import Userform from './user_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Logmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            logData:[],

        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getLogData();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getLogData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUrl+'getLog', headers)
        .then(result => {
            if(this._isMounted){
                this.setState({logData:result.data.Items})
                this.setState({loading:false})
                $('#log_table thead tr').clone(true).appendTo( '#log_table thead' );
                $('#log_table thead tr:eq(1) th').each( function (i) {
                    var title = $(this).text();
                    $(this).html( '<input type="text" style="width: 100%" placeholder="Search '+title+'" />' );
                    $(this).addClass("sort-style");
                    $( 'input', this ).on( 'keyup change', function () {
                        if ( table.column(i).search() !== this.value ) {
                            table
                                .column(i)
                                .search( this.value )
                                .draw();
                        }
                    } );
                } );
                $('#log_table').dataTable().fnDestroy();
                var table = $('#log_table').DataTable(
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

    render () {
        let logData = this.state.logData;
        console.log('123123', logData)
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Log')}</h2>
                </div>
                <div className="orders" style={{paddingTop: 85}}>
                    <div className="table-responsive">
                        <table id="log_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Entity')}</th>
                                <th>PK</th>
                                <th>{trls('FieldName')}</th>
                                <th>{trls('OldValue')}</th>
                                <th>{trls('NewValue')}</th>
                                <th>{trls('GewijzigdOp')}</th>
                            </tr>
                        </thead>
                        {logData && !this.state.loading &&(<tbody >
                            {
                                logData.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.Entiteit}</td>
                                        <td>{data.PK}</td>
                                        <td>{data.VeldNaam}</td>
                                        <td>{data.OudeWaarde}</td>
                                        <td>{data.NieuweWaarde}</td>
                                        <td>{data.GewijzigdOp}</td>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Logmanage);
