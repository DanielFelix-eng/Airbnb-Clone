import bcrypt from 'bcryptjs' 
 import crypto from 'crypto'
import{ User }from '../models/user.model.js'
import { generateToken } from '../utils/setCookie.js'
import { sendVerificationEmail  } from '../resend/resend.js'
 import { sendWelcomeEmail  ,sendResetPasswordEmail , resetPasswordEmail} from '../resend/email.js'
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // ✅ return instead of throw
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpire: new Date(Date.now() + 3600000),
    });

    await user.save();
    generateToken(res, user._id);

    // ✅ Send email BEFORE responding, wrapped in try/catch so it
    //    never bubbles up to the outer catch
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // ✅ return so nothing runs after this
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: { ...user._doc, password: undefined },
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
 //verify email logic
  export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    await sendWelcomeEmail(user.name, user.email, 'https://yourapp.com/dashboard');

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' })
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    user.verificationToken = verificationToken
    user.verificationTokenExpire = new Date(Date.now() + 3600000)
    await user.save()

    await sendVerificationEmail(user.email, verificationToken)

    return res.status(200).json({
      success: true,
      message: 'Verification email resent successfully',
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
};
 //logout
  export const logout = ( req,res) => {
     res.clearCookie('token')
    
    res.status(200).json({ success: true, message: 'Logged out successfully' });
    } 
     
    //login logic 
     export const  login =  async (req,res)=>{ 
      try{ 
         const  {email , password} = req.body ;
          if(!email || !password){
            return res.status(400).json({ message: 'Please provide all fields' });
          }
         const user = await User.findOne({ email });
         if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
         }
         generateToken(res, user._id); 
         user.lastlogin  =  new Date() ; 
          await user.save() ;
         return res.status(201).json({
            success: true,
            message: 'Logged in successfully',
            user: { ...user._doc, password: undefined },
         });
     } catch (error) {
        return res.status(500).json({ message: error.message });
     } }
       //forgot password logic 
        export const  forgotPassword = async (req,res) => {  
           const { email } = req.body ;
          try {
             const user =  await User.findOne({
               email 
             })  
             if(!user ) {
               return res.json({ success: false , message : 'User not found' }) ;
             }
              const token = crypto.randomBytes(20).toString('hex') ;
               const resetTokenExpires  =   Date.now() + 3600000 ;
                user.resetPasswordToken = token ;
                 user.resetPasswordExpire = resetTokenExpires ;
                  await user.save() ;
                   // send email
                   await sendResetPasswordEmail(user.name, user.email, `http://localhost:5173/resetPassword?token=${token}`);
                   return res.status(200).json({ success: true, message: 'Password reset email sent' });
              
          } catch (error) {
             return res.status(500).json({ success: false, message: error.message });
          }
        }
         //reset password logic 
          export const resetPassword =  async (req,res) =>{ 
            try {
               const  { token} = req.params ; 
                const  {password} =  req.body
   const user = await User.findOne({
     resetPasswordToken:token, 
     resetPasswordExpire: { $gt: Date.now() } ,

   })
    if(!user){
       return res.status(400).json({ success: false, message: 'Invalid or expired token' }); 

    }
     //update password 
      const hashedPassword = await bcrypt.hash(password, 10) ;
       user.password = hashedPassword
        user.resetPasswordToken = undefined ;
          user.resetPasswordExpire = undefined ;
        await user.save()
         await resetPasswordEmail(user.email) ; 
         res.status(200).json({ success: true, message: 'Password reset successful' });
     
               }catch(error){
                  return res.status(500).json({ success: false, message: error.message });
               }
             
          }
           //check auth 
            export  const checkauth =  async () => { 
           try {
               const user  =  await User.findById(req.userId) 

               if(!user) { 
                return res.status(400).json({success:false ,  message:error.message})

               }
                res.status(200).json({success:true ,user }) 
             
           } catch (error) {
             console.log("Error in checking authentication ") 

            return res.status(200).json({success:false  , message:error.message})
           }

            }           