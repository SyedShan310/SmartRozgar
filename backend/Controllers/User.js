import User from "../Models/User.js";
import Tasker from "../Models/Tasker.js";

const getMe = async (req, res) => {
  try {
    const Model = req.user.role === 'tasker' ? Tasker : User;
    const user = await Model.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUserById=async(req,res)=>{
    try{
        console.log("working")
        const User_id=req.params.userId;
        console.log(User_id)
        const user=await User.findById(User_id);
        console.log(user)
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export { getMe };
export default getUserById;