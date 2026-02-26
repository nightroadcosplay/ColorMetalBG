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


    function getNewMessages(){
        fetch(URL_API+'/users_mailbox/new_messages_for_me')
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
                        self.postMessage({'cmd':'resultMyNewMessages','newMails':data.newMails});
                    });
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    }


    switch (data.cmd) {
        case 'getNewMessages':
            console.log('getNewMessages?!')
            //getNewMessages(self);
            //setInterval(getNewMessages(self), 2000);
            setInterval(function(){
                getNewMessages();
            }, 20000);
            /*fetch(URL_API+'/users_mailbox/new_messages_for_me')
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
                            self.postMessage({'cmd':'resultMyNewMessages','newMails':data.newMails});
                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
            */
            break;
    }
}, false);
