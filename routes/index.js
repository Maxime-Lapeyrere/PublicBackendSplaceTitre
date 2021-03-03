var express = require('express');
var router = express.Router();

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')

const {fixDate, getDistanceFromLatLonInKm} = require('./helper_func')

// MAP & SWIPE ROUTES

//get events
router.post('/get-events', async (req,res)=> {

  const events = []

  let {sportsSelected, distancePreference, userLocation} = req.body
  //date and time might be added later to optimise filtered info
  //once testing done, replace let by const

  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  for (let i = 0; i < sportsSelected.length;i++) {

    const eventsFound = await EventModel.find({sport: sportsSelected[i].id}).populate('place').exec()

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
          sportImage: e.sportImage? e.sportImage : null,
          eventId: e._id
        })
      }
    })
  }
  res.json({result:true, events})
  
})

//get gymnase/terrains/cmplx sportifs
router.post('/get-places', async (req,res)=> {

  const places = []

  let {sportsSelected, distancePreference, userLocation} = req.body
  //date and time might be added later to optimise filtered info
  //once testing done, replace let by const
  
  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  for (let i = 0; i < sportsSelected.length;i++) {

    console.log(sportsSelected[i])
    const placesFound = await PlaceModel.find({sports: sportsSelected[i].id}) //will have to add .populate('events').exec() once we've optimised places db fulfilling
    console.log(placesFound)
    placesFound.forEach(e => {
      const {latitude,longitude,name,sports,address,futureEvents} = e.location
      console.log(getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon,latitude , longitude))
      console.log(places.findIndex(o => o.placeId === e._id))
      if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon,latitude , longitude) <= distancePreference && places.findIndex(o => o.placeId === e._id) === -1) {
        places.push({
          placeId: e._id,
          name,
          sports,
          location: {latitude,longitude},
          address,
          futureEvents
        })
      }
    })
  }
  console.log(places)
  res.json({result:true, places})

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
