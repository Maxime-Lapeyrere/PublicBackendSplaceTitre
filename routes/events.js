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
        res.json({result:true, eventId: savedEvent._id, message:"Votre évènement a bien été crée."})
        //the route invite users will be called if result is true
    } catch (error) {
        console.log(error)
        res.json({result:false, message: "Un problème est survenu lors de la création de votre évènement."})
    }
    
})

//invite user ('/get-friends' route will first render the people the admin can invite, without the one already invited)
router.post('/invite-users', (req,res) => {
    //body : user token and searched user's object id, + boolean for adding user after creating an event or during
    //check boolean event creation
    //find searched users and send notification/email
    //res.json a bool
})

//edit event, the infos of the event will be pre-loaded on the frontend via the route /users/get-my-events
router.put('/update-event', async (req,res) => {
    //body: event id and event infos
    //find event
    //update infos
    //save
    //res json a bool and event id

    const {eventId, title, time, date, address, placeId, handiSport,mix, privateEvent,invitedUsers} = req.body

    const event = await EventModel.findOne({_id: eventId})
    if (!event) {
        res.json({result:false, message: "Un problème est survenu lors de la modification de cette évènement."})
        return
    }
    try {
        event.invitedUsers = invitedUsers
        event.title = title
        event.address = address
        event.place = placeId
        event.time = fixDate(date,time)
        event.handiSport = handiSport
        event.mix = mix
        event.privateEvent = privateEvent

        await event.save()

        res.json({result:true, message:"Votre évènement a bien été modifié."})      
        //the route invite users will be called if result is true and will check what users is different from before  
    } catch (error) {
        res.json({result:false, message:"Un problème est survenu lors de la modification de cette évènement."})
    }
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