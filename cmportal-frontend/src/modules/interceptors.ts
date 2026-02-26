import axios from 'axios';
import { Notify,Loading } from 'quasar';

export default function setup() {
    axios.interceptors.response.use((response) => {
        console.log('OK interceptors axios response=%o',response);
        if(response.data && response.data.status && response.data.status==='error' && response.data.message){
            console.log('interceptors axios response.data.message=%o',response.data.message)
            Loading.hide();
            Notify.create({
                color: 'red',
                textColor: 'white',
                type: 'negative',
                message: response.data.message,
                position: 'top',
                timeout: 3500,
            })
        }
        return response;
    }, (error) => {
        console.log('Error interceptors axios response=%o, error.response.data=%o',error,error.response.data)
        let error_details='';
        if(error.response && error.response.data && error.response.data.status && error.response.data.status!='success' && error.response.data.message){
            error_details =  Object.values(error.response).toString()+' (Mesaj aplicatie: '+error.response.data.message+')';
        }else{
            error_details = Object.values(error.response).toString();
        }
        Loading.hide();

        Notify.create({
            color: 'red',
            textColor: 'white',
            type: 'negative',
            message: error_details,
            position: 'top',
            timeout: 3500,
        })
        return Promise.reject(error);
    });

    axios.interceptors.request.use(
        function(config) {
            // Do something before request is sent
            config.withCredentials = true;
            return config;
        },
        function(error) {
            // Do something with request error
            return Promise.reject(error);
        }
    );
}
