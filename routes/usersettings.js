var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

/* GET THE USER INFORMATION IN THE USER SETTINGS PAGE */
router.get('/', function(req, res, next) {
console.log(req.session.user);
  if (req.session.user === undefined) {
    res.render('error', {
      message: "Unauthorized access",
      status: 403,
      description: 'You need to be logged in to view the user settings page',
      user: 'guest'
    })
  }
  else {
    res.render("usersettings", {
      user: req.session.user
    })
  }
});


// PUT FOR UPDATING THE ACCOUNT INFORMATION
router.put('/updateaccount', function (req, res, next) {
  if (req.body.oldPassword.trim() === "") {//The user did not enter his old password
    res.render('error', {
      message: 'Missing entry',
      status: 400,
      description: 'You need to enter your old password in order to proceed with the account updates',
      user: req.session.user
    });
  } //if req.body.oldPassword === ""
  else { //The user entered his oldPassword
    knex('users')
    .select()
    .where({email: req.session.user})
    .returning('*')
    .then(function(usersOldInfo){
      var userOldInfo = usersOldInfo[0];
      if (bcrypt.compareSync(req.body.oldPassword, userOldInfo.hashed_password) !== true) {
        console.log("the password entry does not match the one in database");
        res.render('error', {
          message: 'Invalid entry',
          status: 400,
          description: 'The existing password you entered does not match the one in the database. Please try again',
          user: req.session.user
        });
      }
      else {
        console.log("the password entry matches the one in database");
        if (req.body.email.trim() === req.session.user) { //req.body.email is same as session
          res.render('error', {
            message: 'Invalid entry',
            status: 400,
            description: 'The email you entered is already associated with this account. Please enter a new email if you need to update',
            user: req.session.user
          })
        }
        else if (req.body.email.trim() !== "") {
          if (req.body.newPassword.trim() === "") { //new password is empty but email is not
            knex('users')
            .select()
            .where({email: req.session.user})
            .update({email: req.body.email.trim()})
            .then(function () {
              console.log("the account has been updated with the following information:", req.body.email);
              req.session.user = req.body.email.trim();
              req.session.cookie.maxAge = 24 * 60 * 60 * 10;
              res.render('success', {
                message: "Successful update",
                status: 200,
                description: "Your account info was sucessfully updated",
                user: req.body.email.trim()
              })
            });
          }
          else { //the user is updating both his email and password
            var hashedPassword = new Promise(function (resolve, reject) {
              resolve(saltPassword(req.body.newPassword));
            });

            hashedPassword
            .then(function(pwd) {
              knex('users')
              .select()
              .where({email: req.session.user})
              .update({
                email: req.body.email.trim(),
                hashed_password: pwd
              })
              .then(function(){
                req.session.user = req.body.email.trim();
                req.session.cookie.maxAge = 24 * 60 * 60 * 10;
                res.render('success', {
                  message: "Successful update",
                  status: 200,
                  description: "Your account info was sucessfully updated",
                  user: req.body.email.trim()
                })
              });
            })
          }
        }
        else { //req.body.email is blank
          if (req.body.newPassword.trim() === "") { //new password and new email are empty
            res.render('error', {
              message: 'Invalid entry',
              status: 400,
              description: 'You need to enter a valid email and / or password in order to proceed with the account update',
              user: req.session.user
            })
          }
          else { //new email is empty but new password is not
            var hashedPassword = new Promise(function (resolve, reject) {
              resolve(saltPassword(req.body.newPassword));
            });

            hashedPassword
            .then(function (pwd) {
              knex('users')
              .select()
              .where({email: req.session.user})
              .update({hashed_password: pwd})
              .then(function() {
                res.render('success', {
                  message: "Successful update",
                  status: 200,
                  description: "Your account info was sucessfuly updated",
                  user: req.session.user
                })
              })
            })
          }
        }

      }


    });
  } //end of else, the user entered his old password
}); //End of router.put















/*


router.put('/updateaccount', function (req, res, next) {
  console.log(req.body);
  if (req.body.oldPassword.trim() === "") { //The user did not enter his old password
    res.render('error', {
      message: 'Missing entry',
      status: 400,
      description: 'You need to enter your old password in order to proceed with the account updates',
      user: req.session.user
    })
  }
  else { //The user entered in the old password slot
    if (req.body.email.trim() === "" && req.body.newPassword.trim() === "") {
      //user entered old password but did not enter new email or new password
      res.render('error', {
        message: 'Invalid entry',
        status: 400,
        description: 'You need to enter a valid email and / or password in order to proceed with the update',
        user: req.session.user
      })
    }
    else {
      knex('users')
      .select()
      .where({'email': req.session.user})
      .returning('*')
      .then(function(usersOldInfo) {
        var userOldInfo = usersOldInfo[0];
        console.log(userOldInfo);

        if (bcrypt.compareSync(req.body.oldPassword, userOldInfo.hashed_password) === true) {
          console.log("password entered by the user matches the one in database");
          var updateAccountInfo = {}
          if(req.body.email.trim() !== "" && req.body.newPassword.trim() === "") { //If there is an email entry but no password
            updateAccountInfo.email = req.body.email.trim();
          }
          else { //If the user entered a new email
            updateAccountInfo.email = userOldInfo.email;
          }

          if (req.body.newPassword.trim() === "") { //If the user did not enter a new password
            if (req.body.email.trim() === req.session.user) { //The user entered the same email for update
              res.render('error', {
                message: 'Invalid entry',
                status: 400,
                description: 'The email you entered is already associated with this account. Please enter a new email if you need to update',
                user: req.session.user
              })
            }
            else { //The user entered a different email for the update and no password
              updateAccountInfo.hashed_password = userOldInfo.hashed_password;

              knex('users')
              .where({email: userOldInfo.email})
              .update({
                email: updateAccountInfo.email,
                hashed_password: updateAccountInfo.hashedPassword
              })
              .returning('*')
              .then(function(updateAccountInfo) {
                {
                  console.log("the account has been updated with the following information:", updateAccountInfo);
                  req.session.user = req.body.email;
                  req.session.cookie.maxAge = 24 * 60 * 60 * 10;
                  res.render('success', {
                    message: "Successful update",
                    status: 200,
                    description: "Your account info was sucessfully updated",
                    user: req.body.email
                  })
                }
              })
            }
          }
          else { //The user entered a new password, so hash and update
            if (req.body.email.trim() !== "" && req.body.email.trim() !== req.session.user) {
              var hashedPassword = new Promise(function (resolve, reject) {
                resolve(saltPassword(req.body.newPassword));
              })
              updateAccountInfo.email = req.body.email.trim();
              console.log(updateAccountInfo);

              hashedPassword
              .then(function(pwd){
                console.log("before the KNEX");
                console.log(updateAccountInfo);
                knex('users')
                .update({
                  email: req.body.email.trim(),
                  hashed_password: pwd
                })
                .returning('*')
                .then(function (updatedUsers) {
                  console.log("the account has been updated with the following information:", updateAccountInfo);
                  req.session.user = req.body.email;
                  req.session.cookie.maxAge = 24 * 60 * 60 * 10;
                  res.render('success', {
                    message: "Successful update",
                    status: 200,
                    description: "Your account info was sucessfully updated",
                    user: req.body.email
                  })
                });
              })
            }
            else if (req.body.email.trim() === "") {//The user did not enter an email but entered a password
              var hashedPassword = new Promise(function (resolve, reject) {
                resolve(saltPassword(req.body.newPassword));
              })

              hashedPassword
              .then(function(pwd){
                updateAccountInfo.hashed_password = pwd;
              })
              .then(function () {
                console.log("before the KNEX");
                console.log(updateAccountInfo);
                knex('users')
                .update({
                  hashed_password: updateAccountInfo.hashed_password
                })
                .returning('*')
                .then(function () {
                  console.log("the account has been updated with the following information:", updateAccountInfo);
                  res.render('success', {
                    message: "Successful update",
                    status: 200,
                    description: "Your account info was sucessfully updated",
                    user: req.session.user
                  })
                });
              })
            }
            else {
              res.render('error', {
                message: 'Invalid entry',
                status: 400,
                description: 'The email you entered is already associated with this account. Please enter a new email if you need to update',
                user: req.session.user
              })
            }
          }
        }
        else { //Old password does not match the one in the database
          res.render('error', {
            message: 'Invalid entry',
            status: 400,
            description: 'The existing password you entered does not match the one in the database. Please try again',
            user: req.session.user
          })
        }
      });
    } //end of nested else statement
  } //end of else statement

});
*/


//FUNCTIONS FOR PASSWORD HASHING

//Salt of password
function saltPassword(passwordEntry) {
  var salt = bcrypt.genSaltSync(10);
  console.log("The salt is:", salt);
  return hashPassword(passwordEntry, salt);
}

function hashPassword(passwordEntry, salt) {
  var hash = bcrypt.hashSync(passwordEntry, salt);
  console.log("The hash is:", hash);
  return hash;
}

module.exports = router;
