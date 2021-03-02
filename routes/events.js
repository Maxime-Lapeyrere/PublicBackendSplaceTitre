var express = require('express');
var router = express.Router();

const UserModel = require('./db/UserModel')
const EventModel = require('./db/EventModel')

//temporary helper, testing purposes, might be used on front to transform the date and time to a full date
const fixDate = (date, time) => {
    if (typeof date != "string" || typeof time != "string") {
        console.log("One the input are not the correct type.")
        return
    }
    //const dateOnly = date.getDay()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()
    const unix = Date.parse(date + " " + time)
    return new Date(unix)
}

//create event + gestion de l'event (invitations?)
router.post('/create-event', async (req,res) => {

    const {token, invitedUsers, title, time, date, address, placeId, handiSport,mix, privateEvent} = req.body
    //we will format the hour and date from the front and send a full date to the back

    const userFound = await UserModel.findOne({connectionToken : token})
    if (!userFound) {
        res.json({result: false, message: "Un problème est survenu lors de la création de votre évènement.", disconnectUser: true})
        return
    }
    try {
        const newEvent = new EventModel({
            admin: userFound._id,
            invitedUsers,
            participatingUsers: [],
            title,
            address,
            place: placeId,
            time: fixDate(date,time),
            level: undefined,
            handiSport,
            mix,
            privateEvent
        })
        const savedEvent = await newEvent.save()
        userFound.joinedEvents.push(savedEvent._id)
        await userFound.save()
        res.json({result:true, eventId: savedEvent._id})
    } catch (error) {
        console.log(error)
        res.json({result:false, message: "Un problème est survenu lors de la création de votre évènement."})
    }
    
})

//invite user ('/get-friends' route will first render the people the admin can invite)
router.post('/invite-users', (req,res) => {
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