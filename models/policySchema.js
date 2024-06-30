import mongoose from 'mongoose';

const policyInfoSchema = new mongoose.Schema({
    policy_number: { type: String, required: true, unique: true },
    policy_start_date: { type: Date, required: true },
    policy_end_date: { type: Date, required: true },
    policy_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Ensure the ref name matches Company schema
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Ensure the ref name matches User schema
}, {
    timestamps: true
});

const PolicyInfo = mongoose.model('PolicyInfo', policyInfoSchema);

export default PolicyInfo;
