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
  
  const myUser = await UserModel.findOne({connectionToken: req.body.token})

  
  if (!sportsSelected || !distancePreference) {
    res.json({result: false, message: "Missing info"})
    return
  }

  //testing, will have to be removed once testing in Paris is done
  userLocation.lat = 48.866667
  userLocation.lon = 2.333333
  //end

  for (let i = 0; i < sportsSelected?.length;i++) {

    const eventsFound = isOnMap ? await EventModel.find({sport: sportsSelected[i].id}) : await EventModel.find({_id:{"$nin":[...myUser.declinedEvents,...myUser.joinedEvents]},sport: sportsSelected[i].id})
    console.log('cestmesevents',eventsFound.length)
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
  console.log('yolo',events.length)
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

  const requestingUser = await UserModel.findOne({connectionToken: req.body.token})
  
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



  const requestingUser = await UserModel.findOne({connectionToken: req.body.token})
  
  // console.log('test usersFound',[...requestingUser.swipedPeople, ...requestingUser.friendRequestsSwipe])
  const usersFound = await UserModel.find({id:{"$nin": [...requestingUser.swipedPeople, ...requestingUser.friendRequestsSent]}, birthday: {$gte: date2, $lte: date1}, gender: genderSelected.name})
  // const usersFound = await UserModel.find({birthday: {$gte: date2, $lte: date1}, gender: genderSelected.name})
  
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

//swipe people
router.post('/like', async (req,res)=> {

  const {likedId, token} = req.body // userID = targeted user, token = actual user using app
  
  const requestingUser = await UserModel.findOne({connectionToken: token})
  if (!requestingUser) {
    
    res.json({result:false, message: "asking user not found"})
    return
  }
  
  const targetUser = await UserModel.findById(likedId)
  if (!targetUser) {
    
    res.json({result:false, message: "target user not found"})
    return
  }
  requestingUser.friendRequestsSent.push(targetUser._id)
  targetUser.friendRequestsSwipe.push(requestingUser._id)
  await requestingUser.save()
  await targetUser.save()
  

  res.json({result: true})
})

//swipe people
router.post('/dislike', async (req,res)=> {

  const {userID, token} = req.body // userID = targeted user, token = actual user using app
  
  const requestingUser = await UserModel.findOne({connectionToken: token})
  if (!requestingUser) {
    res.json({result:false, message: "asking user not found"})
    return
  }
  const targetUser = await UserModel.findById(userID)
  if (!targetUser) {
    res.json({result:false, message: "target user not found"})
    return
  }

  requestingUser.swipedPeople.push(targetUser._id)

  await requestingUser.save()

  res.json({result: true})

})

router.post('/join-event', async (req,res)=> {

  const {eventId, token} = req.body
console.log('coucou')
  const user = await UserModel.findOne({connectionToken: token})
  console.log('cest passé')
  const eventFound = await EventModel.findById(eventId)
console.log('et la ')
  if (!user) {
    res.json({result:false, message: "asking user not found"})
    return
  }
  if (!eventFound) {
    res.json({result:false, message: "event not found"})
    return
  }

  user.joinedEvents.push(eventFound._id)
  eventFound.participatingUsers.push(user._id)

  await user.save()
  await eventFound.save()

  res.json({result:true})
})

router.post('/decline-event', async (req,res)=> {

  const {eventId, token} = req.body
  
  const user = await UserModel.findOne({connectionToken: token})
  const eventFound = await EventModel.findById(eventId)

  if (!user) {
    res.json({result:false, message: "asking user not found"})
    return
  }
  if (!eventFound) {
    res.json({result:false, message: "event not found"})
    return
  }

  user.declinedEvents.push(eventFound._id)

  await user.save()

  res.json({result:true})
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
