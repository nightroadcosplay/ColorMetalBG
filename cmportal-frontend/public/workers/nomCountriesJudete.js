// import {URL_SITE} from '@/config';

addEventListener('message', function(e) {
    var data = e.data;
    const URL_API = ( function() {
        if ( location.hostname === 'localhost') {
            return 'http://localhost:83'
            //return 'https://portal-color.theappsonline.com/api'
            //return 'http://regisdra-test/api';
        } else {
            //return 'http://localhost/api'
            //return 'https://regis.theappsonline.com/api'
            return '/api';
        }
    })();
    switch (data.cmd) {
        case 'getNomCountries':
            fetch(`${URL_API}/api/nomenclatoare/countries/`+Math.random())
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }

                        // Examine the text in the response
                        response.json().then(function (data) {
                            console.log('in web worker, after fetch=%o',data);
                            self.postMessage({'cmd':'resultNomCountries','countries':data.countries});
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            break;
        case 'getNomJudete':
            fetch(`${URL_API}/api/nomenclatoare/judete/`+Math.random())
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }

                        // Examine the text in the response
                        response.json().then(function (data) {
                            console.log('in web worker, after fetch=%o',data);
                            self.postMessage({'cmd':'resultNomJudete','judete':data.judete});
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            break;
    }
}, false);
