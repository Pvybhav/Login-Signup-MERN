const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
    // app.get('/api/counters', (req, res, next) => {
    //   Counter.find()
    //     .exec()
    //     .then((counter) => res.json(counter))
    //     .catch((err) => next(err));
    // });
  
    // app.post('/api/counters', function (req, res, next) {
    //   const counter = new Counter();
  
    //   counter.save()
    //     .then(() => res.json(counter))
    //     .catch((err) => next(err));
    // });

    // Sign up
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;
        if(!firstName){
            return res.send({
                success: false,
                message: 'Error: first name cannot be blank'
            });
        }
        if(!lastName){
            return res.send({
                success: false,
                message: 'Error: last name cannot be blank'
            });
        }
        if(!email){
            return res.send({
                success: false,
                message: 'Error: email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }
        
        email = email.toLowerCase();
        
        // verify email doesn't exist
        // save

        User.find({
            email : email
        }, (err, previousUsers) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            else if(previousUsers.length > 0){
                return res.send({
                    success: false,
                    message: 'Error: Accout already exists'
                });
            }
            
            const newUser = new User();

            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password)
            newUser.save((err, user) => {
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up successfully'
                });
            });
        });
    });
    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        console.log("body in signin ==>"+ body.password, body.email)
        const {
            password
        } = body;
        let {
            email
        } = body;
        if(!email){
            return res.send({
                success: false,
                message: 'Error: email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }

        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: server error'
                });
            }
            if(users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid @ users.length'
                });
            }

            const user = users[0];

            if(!user.validPassword(password)){
                return res.send({
                    success: false,
                    message: 'Error: Invalid password', password
                });
                console.log(user.validPassword(password))
                console.log(password)
            }
            const userSession = new UserSession();
            userSession.userId = user._id;

            userSession.save((err, doc) => {
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error: server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'valid signin',
                    token: doc._id
                })
            })
        })        
    });
    app.get('/api/account/verify', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if(sessions.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            }
            else{
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        })
    });
    app.get('/api/account/logout', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        },{
            $set :{isDeleted:true}
        }, null, (err, sessions) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            res.send({
                success: true,
                message: 'Good'
            })
        })
    })
};