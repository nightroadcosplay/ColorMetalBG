addEventListener('message', function(e) {
    var data = e.data;
    const URL_API = '/api'; //relative, like the app: same origin in dev (proxied) and in production
    switch (data.cmd) {
        case 'getFavorites':
            fetch(URL_API+'/favorites/', {credentials: 'include'})
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
                            self.postMessage({'cmd':'resultFavorites','products':data.products});
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            break;
    }
}, false);
