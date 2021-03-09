const sportIds = [
    {
        name: "escalade",
        id: '503289d391d4c4b30a586d6a'
    },
    {
        name: 'badminton',
        id: '52e81612bcbc57f1066b7a2b'
    },
    {
        name: 'basketball',
        id: '4bf58dd8d48988d1e1941735'
    },
    {
        name: 'boxe',
        id: '52f2ab2ebcbc57f1066b8b47'
    },
    {
        name: 'velo',
        id: '52f2ab2ebcbc57f1066b8b49'
    },
    {
        name: 'natation',
        id: '4bf58dd8d48988d105941735'
    },
    {
        name: 'fitness',
        id: '52f2ab2ebcbc57f1066b8b48'
    },
    {
        name: 'musculation',
        id: '4bf58dd8d48988d176941735'
    },
    {
        name: 'dojo',
        id: '4bf58dd8d48988d101941735'
    },
    {
        name: 'gymEnPleinAir',
        id: '58daa1558bbb0b01f18ec203'
    },
    {
        name: 'pilates',
        id: '5744ccdfe4b0c0459246b4b2'
    },
    {
        name: 'running',
        id: '5744ccdfe4b0c0459246b4b2'
    },
    {
        name: 'yoga',
        id: '4bf58dd8d48988d102941735'
    },
    {
        name: 'hockeySurGazon',
        id: '4f452cd44b9081a197eba860'
    },
    {
        name: 'hockeySurGlace',
        id: '56aa371be4b08b9a8d57352c'
    },
    {
        name: 'rugby',
        id: '52e81612bcbc57f1066b7a2c'
    },
    {
        name: 'skate',
        id: '4bf58dd8d48988d167941735'
    },
    {
        name: 'patinage',
        id: '4bf58dd8d48988d168941735'
    },
    {
        name: 'football',
        id: '4cce455aebf7b749d5e191f5'
    },
    {
        name: 'squash',
        id: '52e81612bcbc57f1066b7a2d'
    },
    {
        name: 'volleyball',
        id: '4eb1bf013b7b6f98df247e07'
    },
    {
        name: 'tennis',
        id: '4e39a956bd410d7aed40cbc3'
    }
]

const calculateAge = (birthday) => { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

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

  module.exports = {sportIds, fixDate,getDistanceFromLatLonInKm, calculateAge}