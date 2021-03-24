var app = require("../app")
var request = require("supertest")

test('Inscription avec un email déjà existant', async (done) => {
    await request(app).post('/users/sign-up')
        .send({email: "Laurenb@gmail.com", password: "Azerty123@"})
        .expect({result: false, message: "Un champ obligatoire est manquant."})
    done();
})

test("Récuperer les préferences utilisateur sans Token", async (done) => {
    await request(app).post('/users/get-preferences')
        .send({token:""})
        .expect({
            result: false,
            message: "Un problème est survenu lors du chargement de votre profil.",
            disconnectUser: true
        })
    done();
})

test("Champ obligatoire manquant", async (done) => {
    await request(app).post('/users/sign-up')
        .send({username: "Toto", email:"", password: "Toto123@", favoriteSports: {}, bio:"Toto tata", birthday:"", gender:"male", handiSport:false, country:"fr", phoneNumber: "0675654343"})
        .expect({
            result:false,
            message: "Un champ obligatoire est manquant."
        })
    done();
})

module.exports = {
    testEnvironment: 'node'
  };
