addEventListener('message', function(e) {
    var data = e.data;
    const URL_API = ( function() {
        if ( location.hostname === 'localhost') {
            return 'http://localhost:83/api'
            //return 'https://portal-color.theappsonline.com/api'
            //return 'http://regisdra-test/api';
        } else {
            //return 'http://localhost/api'
            //return 'https://regis.theappsonline.com/api'
            return '/api';
        }
    })();
    switch (data.cmd) {
        case 'getBasket':
            fetch(URL_API+'/basket/')
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
                            self.postMessage({'cmd':'resultBasket','products':data.products});
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            break;
    }
}, false);
