import mongoose from "mongoose";

const schema = new mongoose.Schema({
    Agent: {
        type: String,

    },
    userType: {
        type: String,

    },
    policy_mode: {
        type: String,

    },
    producer: {
        type: String,

    },
    policy_number: {
        type: String,

    },
    premium_amount: {
        type: String,

    },
    policy_type: {
        type: String,

    },
    company_name: {
        type: String,

    },
    category_name: {
        type: String,

    },
    policy_start_date: {
        type: Date,

    },
    policy_end_date: {
        type: Date,

    },
    csr: {
        type: String,

    },
    account_name: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String,
    },
    firstname: {
        type: String,
    },
    city: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    state: {
        type: String

    },
    zip: {
        type: String

    },
    dob: {
        type: Date
    }

})


const userSchema = mongoose.model('userSchema', schema);    

export default userSchema