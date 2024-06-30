import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    company_name: { type: String, required: true }
}, {
    timestamps: true
});

const companySchema = mongoose.model('Company', schema); // Ensure the model name matches the ref name in policyInfoSchema

export default companySchema;
