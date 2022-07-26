const User = require('./models/User');
const jwt = require('jsonwebtoken');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.send('Please login first.')
    }
    next();
};

module.exports.authenticateToken= (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.send("ACCESS TOKEN NEEDED");
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userToken) => {
        if (err) return res.send("INVALID TOKEN INSERTED");
        let user = await User.findById(userToken.userId);
        if(!user) return res.send("NO USER FOUND");
        if (user.access_token != token) return res.send("INVALID TOKEN INSERTED");
        res.locals.userId = userToken.userId;
        console.log("Valid Token");
        next()
      });
}

module.exports.validateSentGift = (req, res, next)=>{
    const sentGiftSchema = Joi.object({
        user_id: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().required(), 
        candidate_id: Joi.string().required(), 
        gift_id: Joi.string().required(), 
        send_date_time: Joi.string().required(), 
        token: Joi.number().required().min(0),
        price:Joi.number().required().min(0)
    })
    const {error} = sentGiftSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);     
    }else{
        next();
    }

}

