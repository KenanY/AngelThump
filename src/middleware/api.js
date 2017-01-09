'use strict';

const rp = require('request-promise');

module.exports = function(app) {
  return function(req, res, next) {
    const requested_username = req.params.username;
    console.log('api request for ', requested_username);

    app.service('users').find({
      query: { username: requested_username }
    })

    // Then we're good to check apis
    .then((users) => {
      //console.log(users.total, 'users found for that stream username', requested_username);
      if (users.length > 0) {
        const username = users[0].username;
        // const title = users[0].title;
        Promise.all([
          rp({uri:`https://api.angelthump.com/live?app=live&name=${username}`}),
          rp({uri:`https://api.angelthump.com/viewers?app=live&name=${username}`}),
        ]).then( function (values){
          res.json({
            live: values[0].trim() === '1',
            title: `${username}'s stream`,
            // title: title,
            viewers: parseInt(values[1], 10),
            thumbnail: `https://api.angelthump.com/thumbnail/${username}.jpg`,
          });
        }).catch(() => res.status(404).send('API Date Not Found'));
      }else{
        res.status(404).send(`No Users Named ${requested_username}`);
      }
    })
    // On errors, just call our error middleware
    .catch((e) => {
      console.log(e, 'forbidden requested_username:', requested_username);
      console.error(e.stack);
      res.status(403).send('Forbidden');
    });
  };
};
