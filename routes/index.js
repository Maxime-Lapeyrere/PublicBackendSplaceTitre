var express = require('express');
var router = express.Router();
var userModel = require('./db/UserModel')
var eventModel = require('./db/EventModel')

const request = require('async-request')
const requestSync = require('sync-request')

const EventModel = require('./db/EventModel')
const PlaceModel = require('./db/PlaceModel')

const {fixDate, getDistanceFromLatLonInKm, sportIds, calculateAge} = require('./helper_func');
const UserModel = require('./db/UserModel');

// MAP & SWIPE ROUTES

//get events
router.post('/get-events', async (req,res)=> {

  const events = []

  let {sportsSelected, distancePreference, userLocation, isOnMap} = req.body
  //date and time might be added later to optimise filtered info
  //once testing done, replace let by const

  if (!sportsSelected || !distancePreference) {
    res.json({result: false, message: "Missing info"})
    return
  }

  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  for (let i = 0; i < sportsSelected?.length;i++) {

    const eventsFound = isOnMap ? await EventModel.find({sport: sportsSelected[i].id}) : await EventModel.find({sport: sportsSelected[i].id}).populate('places').exec()

    if (isOnMap) {
      eventsFound.forEach(e => {
        if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon) <= distancePreference 
        && !e.place) {
          events.push({
            title: e.title,
            address: e.address,
            sport: e.sport ? e.sport : null,
            sportName: e.sportName ? e.sportName : null,
            placeLocation: {lat:e.location.lat,lon: e.location.lon},
            placeName: e.title,
            time: e.time,
            handiSport: e.handiSport,
            mix: e.mix,
            sportImage: e.sportImage? e.sportImage : null,
            eventId: e._id,
            distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon)
          })
        }
      })
    } else {
      eventsFound.forEach(e => {
        if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon) <= distancePreference) {
          events.push({
            title: e.title,
            address: e.address,
            sport: e.sport ? e.sport : null,
            sportName: e.sportName ? e.sportName : null,
            placeLocation: {lat:e.location.lat,lon: e.location.lon},
            placeName: e.place ? e.place.name : e.title,
            time: e.time,
            handiSport: e.handiSport,
            mix: e.mix,
            sportImage: e.sportImage? e.sportImage : null,
            eventId: e._id,
            distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon)
          })
        }
      })
    }
    
  }
  res.json({result:true, events})
  
})


//get events for my rdv
router.post('/get-myevents', async (req,res)=> {

  const events = []

  let {distancePreference, userLocation, isOnMap} = req.body
  //date and time might be added later to optimise filtered info
  //once testing done, replace let by const

  if (!distancePreference) {
    res.json({result: false, message: "Missing info"})
    return
  }

  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  // for (let i = 0; i < sportsSelected?.length;i++) {
    const myUser = await UserModel.find({connectionToken: req.body.token})
    const eventsFound = isOnMap ? await EventModel.find({participatingUsers: myUser._id}) : await EventModel.find({participatingUsers: myUser._id})

    if (isOnMap) {
      eventsFound.forEach(e => {
        if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon) <= distancePreference 
        && !e.place) {
          events.push({
            title: e.title,
            address: e.address,
            sport: e.sport ? e.sport : null,
            sportName: e.sportName ? e.sportName : null,
            placeLocation: {lat:e.location.lat,lon: e.location.lon},
            placeName: e.title,
            time: e.time,
            handiSport: e.handiSport,
            mix: e.mix,
            sportImage: e.sportImage? e.sportImage : null,
            eventId: e._id,
            distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon)
          })
        }
      })
    } else {
      eventsFound.forEach(e => {
        if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon) <= distancePreference) {
          events.push({
            title: e.title,
            address: e.address,
            sport: e.sport ? e.sport : null,
            sportName: e.sportName ? e.sportName : null,
            placeLocation: {lat:e.location.lat,lon: e.location.lon},
            placeName: e.place ? e.place.name : e.title,
            time: e.time,
            handiSport: e.handiSport,
            mix: e.mix,
            sportImage: e.sportImage? e.sportImage : null,
            eventId: e._id,
            distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, e.location.lat, e.location.lon)
          })
        }
      })
    }
    
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

  for (let i = 0; i < sportsSelected?.length;i++) {

    const placesFound = await PlaceModel.find({sports: sportsSelected[i].id}).populate('events').exec()

    placesFound.forEach(e => {

      const {latitude,longitude} = e.location
      const {_id,name,address,sports,events} = e

      if (getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon,latitude , longitude) <= distancePreference && places.findIndex(o => o.placeId === _id) === -1) {

        const sportNames = []
        sports.forEach(object => {
          const index = sportIds.findIndex(item => item.id === object)
          sportNames.push(sportIds[index].name)
        })
        
        places.push({
          placeId: _id,
          name,
          sports: sportNames.join(', '),
          sportId: sports[0],
          location: {latitude,longitude},
          address,
          events,
          distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon,latitude , longitude)
        })
      }
    })
  }
  places.sort((a,b) => a.distance - b.distance)
  res.json({result:true, places})

})

//get shops
router.post('/get-shops', (req,res) => {
  //filters in body

})

//swipe, load users corresponding to distance preference and sport choice
router.post('/get-users', async (req,res) => {

  const users = []

  let {sportsSelected, distancePreference, userLocation, ageRange, genderSelected} = req.body


  if (!sportsSelected || !distancePreference || !ageRange || !genderSelected) {
    res.json({result: false, message: "Missing info"})
    return
  }

  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  const date1 = new Date()
  date1.setFullYear(date1.getFullYear() - ageRange[0])
  const date2 = new Date()
  date2.setFullYear(date2.getFullYear() - ageRange[1])

  const usersFound = await UserModel.find({birthday: {$gte: date2, $lte: date1}, gender: genderSelected.name})

  console.log("initial users finding")
  console.log(usersFound)
  
  sportsSelected.forEach(sport => {
    usersFound.forEach(user => {
      const distanceFromUser = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, user.geolocation.latitude, user.geolocation.longitude)
      if (distanceFromUser <= distancePreference 
      && user.favoriteSports.find(fav => fav.id === sport.id)) {

        const reverseGeo = requestSync('GET',`https://api-adresse.data.gouv.fr/reverse/?lon=${user.geolocation.longitude}&lat=${user.geolocation.latitude}`)
        const reverseGeoJSON = JSON.parse(reverseGeo.body)

        users.push({
          name: user.username,
          age: calculateAge(user.birthday),
          distance: distanceFromUser,
          city: reverseGeoJSON.features[0]?.properties.city,
          jobTitle: user.jobTitle ? user.jobTitle : null,
          education: user.education? user.education : null,
          favoriteSports: user.favoriteSports,
          bio: user.bio,
          timeAvailable : user.timeAvailable,
          userId: user._id
        })
      }
    })
  })
  res.json({result:true, users})
 


})

//swipe
router.post('/like', (req,res)=> {
  let {likedId, token} = req.body
  console.log(req.body)
  //check if it's an event or an user
  //check if it's an invitation to an event (replace the 'join-event' route from the event family)
})

//swipe
router.post('/dislike', (req,res)=> {
  let {likedId, token} = req.body
  console.log(req.body)
})
router.post('/join-event', async (req,res)=> {
  let {eventId, token} = req.body
  const myUserId = await UserModel.find({connectionToken: req.body.token})
  const eventsFound = await EventModel.find({sport: req.body.eventId})
  eventsFound.participatingUsers = [...eventsFound.participatingUsers, req.body.eventId]
   await eventsFound.save()
  res.json({result:true, message:"Préférence enregistrée."})
})
router.post('/decline-event', (req,res)=> {
  let {eventId, token} = req.body
  console.log(req.body)
})

//get address from custom place while creating an event
router.post('/get-address-from-custom', async (req,res) => {

  const {latitude, longitude} = req.body

  const reverseGeo = await request(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`)
  const reverseGeoJSON = JSON.parse(reverseGeo.body)

  if (reverseGeoJSON) {
    res.json({result: true, address: reverseGeoJSON?.features[0]?.properties.label})
  } else {
    res.json({result:false, message: "Un problème est survenu lors de la recherche de l'adresse."})
  }
  
})


module.exports = router;
