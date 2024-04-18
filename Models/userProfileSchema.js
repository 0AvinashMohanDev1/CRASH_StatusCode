const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crash_assignment_2', // Reference to the Crash_assignment_2 model
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const UserProfileModal = mongoose.model("profiles", userProfileSchema);

module.exports = { UserProfileModal };
