var express = require('express');
var router = express.Router();

const UserModel = require('./db/UserModel')
const EventModel = require('./db/EventModel')

const {sportIds, fixDate} = require('./helper_db')

//create event + gestion de l'event (invitations?)
router.post('/create-event', async (req,res) => {

    const {token, invitedUsers, title, time, date, address, placeId, handiSport,mix, privateEvent, sport} = req.body
    //both time and date are string type

    const sportObject = sportIds.find(e => e.id === sport)
    const sportName = sportObject.name

    const user = await UserModel.findOne({connectionToken : token})
    if (!user) {
        res.json({result: false, message: "Un problème est survenu lors de la création de votre évènement.", disconnectUser: true})
        return
    }
    try {
        const newEvent = new EventModel({
            admin: user._id,
            invitedUsers,
            participatingUsers: [],
            title,
            address,
            sport,
            sportName,
            place: placeId,
            time: fixDate(date,time),
            level: undefined,
            handiSport,
            mix,
            privateEvent
        })
        const savedEvent = await newEvent.save()
        user.joinedEvents.push(savedEvent._id)
        await user.save()
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

    //should be using Expo Push Notif API on front, more research needed
})

//edit event, the infos of the event will be pre-loaded on the frontend via the route /users/get-my-events
router.put('/update-event', async (req,res) => {

    const {eventId, title, time, date, address, placeId, handiSport,mix, privateEvent,invitedUsers,sport} = req.body

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
        event.sport = sport

        await event.save()

        res.json({result:true, message:"Votre évènement a bien été modifié."})      
        //the route invite users will be called if result is true and will check what users is different from before  
    } catch (error) {
        res.json({result:false, message:"Un problème est survenu lors de la modification de cette évènement."})
    }
})

//cancel event
router.post('/cancel-event', async (req,res) => {

    const {token, eventId, newAdminId} = req.body
    const user = await UserModel.findOne({connectionToken: token})

    if (!user) {
        res.json({result: false, message: "Un problème est survenu lors de l'annulation de cet évènement.", disconnectUser: true})
        return
    }
    try {
        const event = await EventModel.findOne({_id: eventId})
        if (event.participatingUsers.indexOf(user._id) === -1 && JSON.stringify(user._id) != JSON.stringify(event.admin)) {
            res.json({result: false, message: "Vous ne participez pas à cet évènement."})
            return
        }

        let message = ""

        if (JSON.stringify(user._id) === JSON.stringify(event.admin)) {
            if(event.participatingUsers.length === 0) {

                await event.remove()

                message =  "Comme votre évènement n'avait aucun participant, il a été supprimé."
            } else {

                const indexNewAdmin = newAdminId ? event.participatingUsers.findIndex(e => JSON.stringify(e) === JSON.stringify(newAdminId)) : Math.floor(Math.random() * event.participatingUsers.length)
                event.admin = newAdminId ? newAdminId : event.participatingUsers[indexNewAdmin]
                event.participatingUsers.splice(indexNewAdmin,1)
                await event.save()
                
                message = "Votre évènement a été supprimé de votre compte et le rôle d'administrateur a été délégué."
                //+ notification to participating users
            }

        } else {
            const indexCancellingUser = event.participatingUsers.findIndex(e => JSON.stringify(e) === JSON.stringify(user._id))
            event.participatingUsers.splice(indexCancellingUser,1)
            await event.save()
            message = "Vous avez bien annulé votre venu à cet évènement."
            //+ notif to admin
        }

        const eventIndexInUser = user.joinedEvents.findIndex(e => JSON.stringify(e) === JSON.stringify(eventId))
        user.joinedEvents.splice(eventIndexInUser, 1)
        await user.save()

        res.json({result: true, message})

    } catch (error) {
        res.json({result: false, message: error})
    }
    
})

module.exports = router;