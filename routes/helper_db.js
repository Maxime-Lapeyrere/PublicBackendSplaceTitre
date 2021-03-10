var express = require('express')
var router = express.Router()

const request = require('async-request')

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')
const UserModel = require('./db/UserModel')

const {sportIds} = require('./helper_func')

const cities = [
    {
        name: "paris",
        lat: 48.856614,
        lon: 2.3522219
    },
    {
        name: "marseille",
        lat: 43.2961743,
        lon: 5.3699525
    },
    {
        name: "toulouse",
        lat: 43.6044622,
        lon: 1.4442469
    },
    {
        name: "lyon",
        lat: 45.7578137,
        lon: 4.8320114
    },
    {
        name: "nice",
        lat: 43.7009358,
        lon: 7.2683912
    },
    {
        name: "nantes",
        lat: 47.2186371,
        lon: -1.5541362
    },
    {
        name: "strasbourg",
        lat: 48.584614,
        lon: 7.7507127
    },
    {
        name: "montpellier",
        lat: 43.6112422,
        lon: 3.8767337
    },
    {
        name: "bordeaux",
        lat: 44.841225,
        lon: -0.5800364
    },
    {
        name: "lille",
        lat: 50.6365654,
        lon: 3.0635282
    },
    {
        name: "metz",
        lat: 49.1196964,
        lon: 6.1763552
    },
]

//filling places DB
router.get('/fill-places-internal', async (req,res) => {

    const targetRadius = 20000 //in meters

   // await PlaceModel.deleteMany({}).then(() => console.log("Places data cleared.")).catch(err => console.log(err))
    //in future, we wont delete all places, we'll just add the one missings by comparing their apiID, so we'll be able to save the futureEvents for them to be passed over
    const placesBackUp = await PlaceModel.find({})
    
        for (let j = 0; j < 3; j++) { // replace 1 by cities.length for full list of city, here only Paris will be searched, for test purposes
            for (let k = 0; k < sportIds.length;k++) {
                const result = await request(`https://api.foursquare.com/v2/venues/search?client_id=ID0H1AIMM4ACISZJSL4LOHDEUROIBXYL1REZWETBZ0Q3XQ23&client_secret=WY2S0O3CSK5E1XAGEJ4GYE0V1VPLAR1MBBJE5KS1ORUF0DKW&v=20210215&ll=${cities[j].lat}, ${cities[j].lon}&radius=${targetRadius}&query=&categoryId=${sportIds[k].id}`)
                const resultJson  = JSON.parse(result.body)
                const places = resultJson.response.venues

                if(places.length > 0) {
                    for (let i = 0; i< places.length;i++) {
                        const e = places[i]
                        
                        if (placesBackUp.findIndex(obj => obj.apiID === e.id) === -1) {
                            const reverseGeo = await request(`https://api-adresse.data.gouv.fr/reverse/?lon=${e.location.lng}&lat=${e.location.lat}`)
                            const reverseGeoJSON = JSON.parse(reverseGeo.body)
    
                        const newPlace = new PlaceModel({
                            apiID: e.id,
                            name: e.name,
                            location: {
                                latitude: e.location.lat,
                                longitude: e.location.lng
                            },
                            address: reverseGeoJSON.features[0]?.properties.label,
                            sports: e.categories.map(category => category.id),
                            affluence: undefined,
                            free: undefined,
                            public: undefined,
                            contact: [],
                            covering: undefined,
                            icons: e.categories.map(category => category.icon.prefix + category.icon.suffix),
                            events: []
                        })
                        await newPlace.save()
                        }
                    }
                }
            }
        }

        console.log("Places DB has been filled.")
        res.send("Places DB has been filled.")
        
})

//taking invitedUsers from one event and moving them to participatingUsers
router.put('/fill-participation', async (req,res) => {
    const {eventId} = req.body

    const event = await EventModel.findOne({_id: eventId})

    if (!event) {
        console.log("No event found.")
        res.send("No event found.")
        return
    }
    if (event.invitedUsers.length === 0) {
        console.log("No invited user.")
        res.send("No invited user.")
        return
    }

    try {
        for (let i = 0; i < event.invitedUsers.length ; i++) {
            const user = await UserModel.findOne({_id: event.invitedUsers[i]})
            if (user) {
                user.joinedEvents.push(event._id)
                await user.save()
                
                event.participatingUsers.push(event.invitedUsers[i])
                event.invitedUsers.splice(i,1)
                i--
                await event.save()
            } else {
                console.log("No user found.")
                res.send("No user found.")
                return
            }
        }
        console.log("invited users set to participate.")
        res.send("invited users set to participate.")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    
})

//self-explanatory
router.post('/fill-events-random-data', async (req,res) => {

})

//self-explanatory
router.post('/fill-users-random-data', async (req,res) => {

})

router.post('/clear-conversations-history', async (req,res) => {

    const {token} = req.body

    const user = await UserModel.findOne({connectionToken: token})
    user.conversations = []
    await user.save()

    res.json({result:true, message: "Conversation history cleared up."})
})

router.post('/clear-swiped-people', async (req,res) => {

    const {token} = req.body

    const user = await UserModel.findOne({connectionToken: token})
    user.swipedPeople = []
    await user.save()

    res.json({result:true, message: "Swiped People cleared up."})
})

router.post('/clear-friends-request-swipe', async (req,res) => {

    const {token} = req.body

    const user = await UserModel.findOne({connectionToken: token})
    user.friendRequestsSwipe = []
    await user.save()

    res.json({result:true, message: "Friends request swipe cleared up."})
})

router.post('/clear-friends-request-general', async (req,res) => {

    const {token} = req.body

    const user = await UserModel.findOne({connectionToken: token})
    user.friendRequestsGeneral = []
    await user.save()

    res.json({result:true, message: "Friends request general cleared up."})
})

router.post('/clear-declined-events', async (req,res) => {

    const {token} = req.body

    const user = await UserModel.findOne({connectionToken: token})
    user.declinedEvents = []
    await user.save()

    res.json({result:true, message: "Declined events cleared up."})
})

module.exports = router