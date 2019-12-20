import { envData } from '../env';
const BASEURL = envData.webservice;
export default {
    GetToken: `${BASEURL}/token`,
    BaseUrl: `${BASEURL}/`,
    GetUrl:   `${BASEURL}/api/factory/execute/esdev/`,
    PostUrl:  `${BASEURL}/api/factory/execute/esdev/`,
  };
  
  