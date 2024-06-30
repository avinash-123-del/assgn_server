import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    agentName: {
        type: String,
        required: true,
    }

});

const agentSchema = mongoose.model('agent', schema);

export default agentSchema;
