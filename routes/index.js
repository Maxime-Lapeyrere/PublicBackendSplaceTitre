var express = require('express');
var router = express.Router();

// MAP & SWIPE, COMMUNITY BELOW

//get events
router.post('/get-events', (req,res)=> {
  //filters in body
  // research events of the user only if needed
})

//get gymnase/terrains/cmplx sportifs
router.post('/get-poi', (req,res)=> {
  //filters in body

})

//get shops
router.post('/get-shops', (req,res) => {
  //filters in body

})

//swipe
router.get('/get-users', (req,res) => {
  //filters in query >> ie distance preferences

})

//swipe
router.post('/like', (req,res)=> {

})

//swipe
router.post('/dislike', (req,res)=> {
  
})


//COMMUNITY
// list d'amis, recherche user, and start conversation

//generer la liste d'amis ET l'historique de conversations
router.post('/get-friends',(req,res) => {
  //fetch friend list and conversations history from db
})

router.post('/search-user', (req,res) => {

})

router.post('/add-friend', (req,res) => {

})

//load conversation only when entering it
router.post('/get-messages', (req,res) => {
  //load conv with conv ID and user token ID for further security
})

router.post('/save-messages', (req,res) => {
  //used in parallel of socket io route
})


module.exports = router;
