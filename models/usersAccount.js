import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    account_name: { type: String, required: true }
}, {
    timestamps: true
});

const accountSchema = mongoose.model('user_account', schema); // Ensure the model name matches the ref name in policyInfoSchema

export default accountSchema;
