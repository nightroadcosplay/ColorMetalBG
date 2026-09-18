addEventListener('message', function(e) {
    var data = e.data;
    const URL_API = '/api'; //relative, like the app: same origin in dev (proxied) and in production


    function getNewMessages(){
        fetch(URL_API+'/users_mailbox/new_messages_for_me', {credentials: 'include'})
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
