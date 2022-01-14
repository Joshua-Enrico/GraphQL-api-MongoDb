const jwt = require('jsonwebtoken');

function generateToken(user) {
    const AccesToken  = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn: "3d"}
    )
    return AccesToken;
}




module.exports = {
    generateToken,
}