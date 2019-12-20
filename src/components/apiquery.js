import SessionManager from './session_manage';
import API from './api'
import Axios from 'axios';

export const getQuery = (query, params) => {
    let returnValue = [];
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetUrl+query, headers)
    .then(result => {
        returnValue = result;
    })
    .catch(err => {
        returnValue =  false;
    });
    console.log('222222', returnValue)
    // return returnValue;
};

export const postQuery = (query, params) => {
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.GetUrl+query, params, headers)
    .then(result => {
        console.log('123123', result);
    })
};