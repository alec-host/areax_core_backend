exports.errorTimeOutHandler = async(err,req,res,next) => {
   if(req.timedout) {
      res.status(504).json({ success: false, error: true, message:'Request timed out' });
   }else {
      next();
   }
};

