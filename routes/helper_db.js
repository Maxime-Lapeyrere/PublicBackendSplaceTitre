var express = require('express')
var router = express.Router()

const request = require('async-request')

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
        name: 'piscine',
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
        name: 'course',
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
]

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

const PlaygroundModel = require('./db/PlaygroundModel')

router.get('/fill-playground-internal', async (req,res) => {

    await PlaygroundModel.deleteMany({}).then(() => console.log("Playground data cleared.")).catch(err => console.log(err))

    try {
        for (let j = 0; j < 2; j++) { // replace 2 by cities.length for full list of city
            for (let k = 0; k < sportIds.length;k++) {
                const result = await request(`https://api.foursquare.com/v2/venues/search?client_id=ID0H1AIMM4ACISZJSL4LOHDEUROIBXYL1REZWETBZ0Q3XQ23&client_secret=WY2S0O3CSK5E1XAGEJ4GYE0V1VPLAR1MBBJE5KS1ORUF0DKW&v=20210215&ll=${cities[j].lat}, ${cities[j].lon}&radius=10000&query=&categoryId=${sportIds[k].id}`)
                const resultJson  = JSON.parse(result.body)
                const playgrounds = resultJson.response.venues

                if(playgrounds.length > 0) {
                    for (let i = 0; i< playgrounds.length;i++) {

                        const e = playgrounds[i]
                        const reverseGeo = await request(`https://api-adresse.data.gouv.fr/reverse/?lon=${e.location.lng}&lat=${e.location.lat}`)
                        const reverseGeoJSON = JSON.parse(reverseGeo.body)
    
                        const newPlayground = new PlaygroundModel({
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
                            icons: e.categories.map(category => category.icon.prefix + category.icon.suffix)
                        })
                    await newPlayground.save()
                    }
                }
            }
        }

        console.log("Playgrounds DB has been filled.")
        res.send("Playgrounds DB has been filled.")
        
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router