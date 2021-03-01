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

const PlaygroundModel = require('./db/PlaygroundModel')

const testUrl = "https://api.foursquare.com/v2/venues/search?client_id=ID0H1AIMM4ACISZJSL4LOHDEUROIBXYL1REZWETBZ0Q3XQ23&client_secret=WY2S0O3CSK5E1XAGEJ4GYE0V1VPLAR1MBBJE5KS1ORUF0DKW&v=20210215&ll=48.86076636445482, 2.3376654555775627&radius=3000&query=&categoryId=4bf58dd8d48988d1e1941735"

router.get('/fill-playground-internal', async (req,res) => {

    await PlaygroundModel.deleteMany({}).then(() => console.log("Playground data cleared.")).catch(err => console.log(err))

    try {
        const result = await request(testUrl)
        const resultJson  = JSON.parse(result.body)
        const playgrounds = resultJson.response.venues

        playgrounds.map(async e => {
            const newPlayground = new PlaygroundModel({
                name: e.name,
                location: {
                    latitude: e.location.lat,
                    longitude: e.location.lng
                },
                address: e.location.formattedAddress.join(' '),
                sports: e.categories.map(category => category.id),
                affluence: undefined,
                free: undefined,
                public: undefined,
                contact: [],
                covering: undefined,
                icons: e.categories.map(category => category.icon.prefix + category.icon.suffix)
            })
            await newPlayground.save()
        })
        console.log("Playgrounds DB has been filled.")
        res.send("Playgrounds DB has been filled.")
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

module.exports = router