import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    dob: { type: String },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    userType: { type: String, required: true }
}, {
    timestamps: true
});

const usersDataSchema = mongoose.model('User', schema); // Ensure the model name matches the ref name in policyInfoSchema

export default usersDataSchema;
