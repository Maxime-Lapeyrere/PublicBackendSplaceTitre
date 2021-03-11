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

router.post('/accept-friends-request', async (req,res) => {

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

  requestingUser.friendsList.push(targetUser._id)
  targetUser.friendsList.push(requestingUser._id)

  await requestingUser.save()
  await targetUser.save()

  res.json({result: true})

})

//load conversation only when entering it
router.post('/get-messages', async (req, res) => {
  //load conv with conv ID and user token for further security

  const {convID, token} = req.body

  const user = await UserModel.findOne({connectionToken: token})
  const conv = await ConvModel.findById(convID)

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  res.json({result:true, conversation: conv})

})

router.post('/save-messages', async (req, res) => {

  console.log("in save-messages route")

  const {convID, messageData, token} = req.body

  console.log("CONVID")
  console.log(convID)

  const realMessageData = {
    text: messageData.text,
    user: messageData.user,
    createdAt: messageData.createdAt
  }

  console.log("createdAt type")
  console.log(typeof realMessageData.createdAt)
  
  let conv = convID ? await ConvModel.findById(convID) : null
  const user = await UserModel.findOne({connectionToken: token})

  console.log("CONV (IF FOUND)")
  console.log(conv)

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  console.log("found user")

  if (!conv) {
    console.log("new conv")
    const newConv = new ConvModel({
      name: "A Conv Name",
      users: [user._id],
      messages: [realMessageData],
      lastMessage: realMessageData.text,
      group : false
    })
    conv = await newConv.save()
    console.log(conv._id)
    user.conversations.push(conv._id)
    await user.save()
  } else {
    conv.messages.push(realMessageData)
    conv.lastMessage = realMessageData.text
    console.log("existing conv")
    console.log(conv._id)
    await conv.save()
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