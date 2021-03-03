var express = require('express');
var router = express.Router();

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')

const {fixDate, getDistanceFromLatLonInKm} = require('./helper_db')

// MAP & SWIPE ROUTES

//get events
router.post('/get-events', async (req,res)=> {
  
  //location will be added later with phone geolocation or with the one saved in user db, we will be using a test location for now (center Paris)
  const testLocation = {
    lat: 48.856614,
    lon: 2.3522219
  }

  const events = []

  const {sportsSelected, distancePreference, time, date} = req.body
  
  
  for (let i = 0; i < sportsSelected.length;i++) {

    const eventsFound = await EventModel.find({sport: sportsSelected[i]}).populate('place').exec()

    eventsFound.forEach(e => {
      if (getDistanceFromLatLonInKm(testLocation.lat, testLocation.lon, e.place?.location?.latitude, e.place?.location?.longitude) <= distancePreference) {
        events.push(e)
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
