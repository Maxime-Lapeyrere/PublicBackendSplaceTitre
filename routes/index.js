var express = require('express');
var router = express.Router();

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')

const {fixDate, getDistanceFromLatLonInKm} = require('./helper_func')

// MAP & SWIPE ROUTES

//get events
router.post('/get-events', async (req,res)=> {
  
  //location will be added later with phone geolocation or with the one saved in user db, we will be using a test location for now (center Paris)

  const events = []

  const {sportsSelected, distancePreference, userLocation} = req.body
  //date and time might be added later to optimise filtered info
  
  
  for (let i = 0; i < sportsSelected.length;i++) {

    const eventsFound = await EventModel.find({sport: sportsSelected[i]}).populate('place').exec()

    eventsFound.forEach(e => {
      if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.place?.location?.latitude, e.place?.location?.longitude) <= distancePreference) {
        events.push({
          title: e.title,
          address: e.address,
          sport: e.sport ? e.sport : null,
          sportName: e.sportName ? e.sportName : null,
          placeLocation: {lat:e.place.location.latitude,lon: e.place.location.longitude},
          placeName: e.place.name,
          time: e.time,
          handiSport: e.handiSport,
          mix: e.mix,
          sportImage: e.sportImage? e.sportImage : null
        })
      }
    })
  }
  res.json({result:true, events})
  
})

//get gymnase/terrains/cmplx sportifs
router.post('/get-poi', (req,res)=> {
  //filters in body

})

//get shops
router.post('/get-shops', (req,res) => {
  //filters in body

})

//swipe, load users corresponding to distance preference and sport choice
router.get('/get-users', (req,res) => {
  //filters in query >> ie distance preferences

})

//swipe
router.post('/like', (req,res)=> {
  //check if it's an event or an user
  //check if it's an invitation to an event (replace the 'join-event' route from the event family)
})

//swipe
router.post('/dislike', (req,res)=> {
  
})


module.exports = router;
