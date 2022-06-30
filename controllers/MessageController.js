const mongoose = require('mongoose');
const Message = mongoose.model('Message');
//const Message = require("../models/messageModel");

const getMessages = async (req, res) => {
  try {

    const from = req.user
    const { to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    res.send(ex);
  }
};

const addMessage = async (req, res) => {
  try {
    const from = req.user;
    const { to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    res.send(ex);
  }
};


const getUserContactedUsers = async (req, res) => {
  try {
    const user = req.user;
    const users = await Message.find({
      users: {
        $all: [user],
      },
    })
    .distinct("users")
    .populate("user", "firstName lastName email")
    .exec();

    res.status(200).send({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (ex) {
    res.send(ex);
  }
}

const getUserConactedUsersWithLastMessage = async (req, res) => {
  try {
    const user = req.user;
    const users = await Message.aggregate([
      {
        $match: {
          users: {
            $all: [user],
          },
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: ["$sender", user],
              },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: {
            $last: "$message",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
        
      },
      // {
      //   $unwind: "$user",
      // },
      {
        $sort: {
          "message.createdAt": -1,
        },
      },
    ]);
    res.status(200).send({
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (ex) {
    res.send(ex);
  }
}





module.exports = { getMessages, addMessage, getUserContactedUsers, getUserConactedUsersWithLastMessage };