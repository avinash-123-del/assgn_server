import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
});

const categorySchema = mongoose.model('category', schema);

export default categorySchema;
