const mongoose = require('mongoose');

const options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}

const url = "mongodb+srv://Swannpnct:Spl@ce2021@db-project-maximelapeyr.kgo2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(url, options, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected to DB.")
    }
});