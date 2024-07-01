const { doubtSchema } = require('../models/formModules')
const asyncHandler = require("express-async-handler") 



// @desc doubt submition for expert       --------------------------------Doubt submition----------------------------
// @route /user/signup
// @access private

const userdoubt = asyncHandler(async (req, res) => {

    // console.log("[C] Error Check :")
    const { doubt, doubtDiscription, field} = req.body;
    const doubtPictures = req.files['doubtPictures'].map(file => file.filename);


    if (!doubt || !doubtDiscription || !field) {
        res.status(400);
        throw new Error("[E] Please fill the every essentials in the form");
    }
    else {
        try {
            const store = await doubtSchema.create({
                doubt,
                doubtDiscription,
                field,
                doubtPictures
            })
            console.log("[T] Doubt data submitted successfully !!")
                res.status(201).json({ 'message': "Field submitted in database successfully: ", "data": req.body })

        } catch (error) { res.status(500).json({ message: error.message }); }

    }
});

module.exports={userdoubt};