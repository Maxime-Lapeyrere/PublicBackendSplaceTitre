var express = require('express');
var router = express.Router();

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')

//HELPERS

const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {

  if (!lat1 || !lat2 || !lon1 || !lon2) return undefined

  var R = 6371;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

const deg2rad = (deg) => {
  return deg * (Math.PI/180)
}

//END

// MAP & SWIPE ROUTES

//get events
router.post('/get-events', async (req,res)=> {
  
  //location will be added later with phone geolocation or with the one saved in user db, we will be using a test location for now (center Paris)
  const testLocation = {
    lat: 48.856614,
    lon: 2.3522219
  }

  const events = []

  const {sportsSelected, distancePreference} = req.body
  
  
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
