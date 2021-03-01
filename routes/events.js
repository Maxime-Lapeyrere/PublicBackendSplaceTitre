var express = require('express');
var router = express.Router();

//create event + gestion de l'event (invitations?)
router.post('/create-event', (req,res) => {
    //body : event infos and user token
    //check if there is already an event at the same time and location (?)
    //store event data through event Model and save it to DB
    //res.json a bool and event id
})

//invite user ('/get-friends' route will first render the people the admin can invite)
router.post('/invite-user', (req,res) => {
    //body : user token and searched user's object id
    //find searched user and send notification/email
    //res.json a bool
})

//edit event
router.put('/update-event', (req,res) => {
    //body: user token and event id
    //find event
    //update infos
    //save
    //res json a bool and event id
})

//cancel event
router.delete('/cancel-event', (req,res) => {
    //body: user token and event id ( optionally the other user id that has been chosen to be new admin)
    //find the event
    //relay admin role to designated user by sending a notification ( random user if previous admin didnt select any)
    //if there is no other user on the event : delete the event from DB
    //res.json a bool and the event id if it still exists
})

module.exports = router;