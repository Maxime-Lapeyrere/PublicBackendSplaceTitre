var express = require('express');
var router = express.Router();

const ConvModel = require('./db/ConvModel')
const UserModel = require('./db/UserModel')


//COMMUNITY
// list d'amis, recherche user, and start conversation

//generer la liste d'amis 
router.post('/get-friends', async (req, res) => {
  //fetch friend list and conversations history from db

  const user = await UserModel.findOne({connectionToken: req.body.token}).populate('friendsList').exec()

  if (!user) {
    res.json({result:false})
    return
  }

  const friends = []
  user.friendsList.forEach(e => friends.push({
    _id: e._id,
    username: e.username,
    profilePicture: e.profilePicture
  }));

  res.json({result: true, friendsList : friends})

})

//ET l'historique de conversations
router.post('/get-conversations-history', async (req, res) => {
  const userR = await UserModel.findOne({ connectionToken: req.body.token })
  const user = await UserModel.findOne({ connectionToken: req.body.token }).populate({path: 'conversations',select: 'name users lastMessage group', populate: {path: 'users', select: '_id username profilePicture', match: { _id: {$ne: userR._id}}}}).exec()

  res.json({ result: true, conversations: user.conversations , id : user._id , avatar : user.profilePicture , name: user.username })
})

// pour la route du point 2, l'idée est de recup le token du user, de chercher le user et de populate le champ 'eventsInvitations' ( que tu as ajouté dans le model du User)
// la route 'get-conversation-history' du fichier community.js est similaire, si jamais 

router.post('/get-invitations-event', async (req, res) => {
  const user = await UserModel.findOne({ connectionToken: req.body.token }).populate({path: 'eventsInvitations'}).exec();

  const events = []
  user.eventsInvitations.forEach(e => {
    const {_id,participatingUsers,title,sportName,time,address,sport,placeName} = e
    events.push({
      title,
      address,
      sport: sport ? sport : null,
      sportName: sportName ? sportName : null,
      placeName: placeName ? placeName : null,
      time,
      participatingUsers,
      eventId: _id,
    })
  })

  res.json({ result: true, events})

})

router.post('/get-invitations-people', async (req, res) => {
  const user = await UserModel.findOne({ connectionToken: req.body.token }).populate({path: 'friendRequestsSwipe'}).exec();

  const users = []
  user.friendRequestsSwipe.forEach(e => {
    const {_id,username, birthday, bio, profilePicture} = e
    users.push({
      username,
      birthday,
      bio,
      profilePicture,
      _id
    })
  })

  res.json({ result: true, users})
})

router.get('/search-users', async (req, res) => {

  const allUsers = await UserModel.find()

  console.log("Sur la route seach users");
  res.json({ result: true, allUsers })


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
  const conv = await ConvModel.findById(convID).populate("users","_id username profilePicture").exec()


  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  const otherUsers = []
  conv.users.forEach(e => {
    if (!e._id.equals(user._id)) otherUsers.push(e)
  })

  res.json({result:true, conversation: conv, otherUsers})

})

router.post('/save-messages', async (req, res) => {

  const {convID, messageData, token, addedUsers} = req.body
  
  let conv = convID ? await ConvModel.findById(convID) : null
  const user = await UserModel.findOne({connectionToken: token})

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  if (!conv && addedUsers.length > 0) {
    const newConv = new ConvModel({
      name: "A Conv Name",
      users: [user._id].concat(addedUsers.map(e => e._id)),
      messages: [messageData],
      lastMessage: messageData.text,
      group : false
    })
    conv = await newConv.save()
    user.conversations.push(conv._id)
    await user.save()
    
    for (let i =0; i < addedUsers.length; i++) {
      const otherUser = await UserModel.findById(addedUsers[i])
      otherUser.conversations.push(conv._id)
      await otherUser.save()
    }

  } else if (conv) {
    conv.messages.push(messageData)
    conv.lastMessage = messageData.text
    await conv.save()
  } else {
    res.json({result:false, message: addedUsers.length === 0 ? "no user added" : "no conv found"})
    return
  }

  res.json({result:true, convID: conv._id})
})


module.exports = router;