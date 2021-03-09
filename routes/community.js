var express = require('express');
var router = express.Router();

const ConvModel = require('./db/ConvModel')
const UserModel = require('./db/UserModel')


//COMMUNITY
// list d'amis, recherche user, and start conversation

//generer la liste d'amis 
router.post('/get-friends', (req, res) => {
  //fetch friend list and conversations history from db
})

//ET l'historique de conversations
router.post('/get-conversations-history', async (req, res) => {
  const user = await UserModel.findOne({ connectionToken: req.body.token }).populate('conversations', 'name users lastMessage group').exec();


  res.json({ result: true, conversations: user.conversations , id : user._id , avatar : user.profilePicture , name: user.username })

})

router.post('/search-users', async (req, res) => {



})

router.post('/add-friend', (req, res) => {



})

//load conversation only when entering it
router.post('/get-messages', (req, res) => {
  //load conv with conv ID and user token for further security
})

router.post('/save-messages', async (req, res) => {
  //used in parallel of socket io route
  //if conv id n'existe pas : create a new conv document, save message
  //body : conv id, messages data

  const {convID, messageData, userID} = req.body
  
  let conv = await ConvModel.findById(convID)
  const user = await UserModel.findById(userID)

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  if (!conv) {
    const newConv = new ConvModel({
      name: "A Conv Name",
      users: [userID],
      messages: [messageData],
      lastMessage: messageData,
      group : false
    })
    conv = await newConv.save()
    user.conversations.push(conv._id)
    await user.save()
  } else {
    conv.messages.push(messageData)
    await newConv.save()
  }
  res.json({result:true, convID: conv._id})
})


module.exports = router;

// route get conv history
// route get load messages
// route save messages
// creer une conv avec no friend
// send 1st message
// save un nouveau doc conv avec en foreign key le user id
// + save conv foreign key dans user convs
// save messages dans conv
// send 2nd message to try
// quit app
// go back et render conv