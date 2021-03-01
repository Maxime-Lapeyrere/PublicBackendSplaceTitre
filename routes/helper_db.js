//only for testing

const request = require('async-request')

var express = require('express')
var router = express.Router()

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