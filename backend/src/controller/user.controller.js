import FriendRequest from "../models/FriendReques.models.js";
import User from "../models/User.models.js";

export const friendSuggestion = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;

    const suggesteduser = await User.find({
      _id: { $ne: userId, $nin: user.friends },
      onBoarding: true,
    });

    res.status(200).json({ suggesteduser });
  } catch (error) {
    return res.status(500).json({
      message: "frined suggestion error ",
      error,
    });
  }
};

export const myfriends = async (req, res) => {
  try {
    const friend = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "fullName  bio  hobbies  location profilePic");

    return res.status(200).json(friend);
  } catch (error) {
    return res.status(500).json({
      message: "get my frined error ",
      error,
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipientId = req.params.id;    
    if (userId === recipientId) {
      return res.status(400).json({
        message: "You can not send request to yourself ",
      });
    }


    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({
        message: "Recipient is not available",
      });
    }

    if (recipient.friends.includes(userId)) {
      return res.status(400).json({
        message: `${recipient.fullName} is already in your friend list `,
      });
    }

    const existingReq = await FriendRequest.findOne({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ],
    });



    if (existingReq) {
      return res.status(400).json({
        message:
          "A friend request is already exist between you and your friend ",
      });
    }

    const creatingReq = await FriendRequest.create({
      sender: userId,
      recipient: recipientId,
    });

    return res.status(201).json(creatingReq);
  } catch (error) {
    return res.status(500).json({
      message: "error in sending friend request controller " +
      error,
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const serderId = req.params.id;
    const myid = req.user.id;

    const frdreq = await FriendRequest.findById(serderId);
    if (!frdreq) {
      return res.status(400).json({
        message: "friend request is not exist ",
      });
    }

    if (frdreq.recipient != myid) {
      return res.status(400).json({
        message: "you're not authorized to accept this friend requset",
      });
    }

    frdreq.status = "accepted";
    await frdreq.save();

    await User.findByIdAndUpdate(frdreq.sender, {
      $addToSet: { friends: frdreq.recipient },
    });

    await User.findByIdAndUpdate(frdreq.recipient, {
      $addToSet: { friends: frdreq.sender },
    });
    return res.status(200).json({
      message: "friend request accepted ",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "error while accepting friend request ",
      error,
    });
  }
};

export const getFriendRequset = async (req, res) => {
  try {
    const userId = req.user._id;
    const penddingreq = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullName  profilePic bio hobbies location ");

    const acceptedreq = await FriendRequest.find({
      recipient: userId,
      status: "accepted",
    }).populate("sender", "fullName  profilePic bio hobbies location ");
    console.log(penddingreq);
    return res.status(200).json({penddingreq, acceptedreq});
  } catch (error) {
    return res.status(500).json({
      message: "getting friend error ",
      error,
    });
  }
};

export const getOutgoingFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const outgoingreq = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("recipient", "fullName ,profilePic bio hobbies location ");
    console.log(outgoingreq);
    return res.status(200).json(outgoingreq);
  } catch (error) {
    return res.status(500).json({
      message: "getting requested friend error ",
      error,
    });
  }
};

export const removeFrinedrq = async(req , res) =>{
     try {
    const userId = req.user._id;
    const recipientId = req.params.id 
    const deletereq = await FriendRequest.findOneAndDelete({
      sender: userId,
      recipient : recipientId ,
      status: "pending",
    }).
    console.log(deletereq);
    return res.status(200).json(deletereq);
  } catch (error) {
    return res.status(500).json({
      message: "remove frined req error",
      error,
    });
  }
}
