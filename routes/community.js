var express = require('express');
var router = express.Router();

const ConvModel = require('./db/ConvModel')
const UserModel = require('./db/UserModel')


//COMMUNITY
// list d'amis, recherche user, and start conversation

//generer la liste d'amis 
router.post('/get-friends',(req,res) => {
    //fetch friend list and conversations history from db
})
  
  //ET l'historique de conversations
router.post('/get-conversations-history', (req,res) => {
  //body : user token 
  //populate conv with conv foreign key

  // renvoyer user _id, avatar ( profilePicture), name (username) + conversations

})
  
router.post('/search-users', (req,res) => {
  
})
  
router.post('/add-friend', (req,res) => {
  
})
  
  //load conversation only when entering it
router.post('/get-messages', (req,res) => {
    //load conv with conv ID and user token for further security
})
  
router.post('/save-messages', (req,res) => {
    //used in parallel of socket io route
    //if conv id n'existe pas : creaete a new conv document, save message
})


module.exports = router;

// route get conv history
// route get laod messages
// route save messages
// creer une conv avec no friend
// send 1st message
// save un nouveau doc conv avec en foreign key le user id
// + save conv foreign key dans user convs
// save messages dans conv
// send 2nd message to try
// quit app
// go back et render conv