import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { hash } from "crypto";
import crypto from "crypto";
import {Meeting} from "../models/meeting.model.js"; 

const register = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existUser = await User.findOne({ username });

    if (existUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User Already Exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(httpStatus.CREATED)
      .json({ message: "User Registered successfully" });
  } catch (error) {
    console.error(error);
    res.json({ message: `Something went wrong ${error}` });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide Email and Password" });
  }
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = crypto.randomBytes(20).toString("hex");
      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({
        token: token,
        message: "User Logged In successfully !",
      });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid User Name or Password",
      });
    }
  } catch (e) {
    return res.status(500).json({ message: `Something went wrong: ${e}` });
  }
};

const getUserHistory = async(req, res) => {
  const {token } = req.query ;
  console.log(token);

  try {
    const user = await User.findOne({token:token});

    console.log(user);
    const meetings = await Meeting.findOne({user_id: user.username})
    
    console.log(meetings);
    res.json(meetings);
  } catch(e) {
    res.json({message:`Something went wrong ${e}`});
  }
}


const addToHistory = async (req, res) => {
  console.log("req Craeted")

  const {token, meeting_code} = req.body;

  try {
    const user = await User.findOne({token:token});
    
    const newMeeting = new Meeting({
      user_id: user.username,
      meeting_id: meeting_code
    })


    await newMeeting.save()
    res.status(201).json({message:"Added meeting to history"});

  } catch(e) {
    res.json({message:`Something went wrong ${e}`});
  }
  
}


export { login, register, getUserHistory,addToHistory };
