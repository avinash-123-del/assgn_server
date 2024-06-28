import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
});

const messageSchema = mongoose.model('Message', schema);

export default messageSchema;
