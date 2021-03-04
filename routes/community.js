var express = require('express');
var router = express.Router();


//COMMUNITY
// list d'amis, recherche user, and start conversation

//generer la liste d'amis 
router.post('/get-friends',(req,res) => {
    //fetch friend list and conversations history from db
})
  
  //ET l'historique de conversations
router.post('/get-conversations-history', (req,res) => {
  
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
})


module.exports = router;