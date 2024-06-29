import multer from 'multer';
import csv from 'csvtojson';
import userSchema from '../models/usersSchema.js';
import messageSchema from '../models/messageSchema.js';
// import userSchema from '../models/usersSchema.js'; 

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// upload csv files
const uploadCsv = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const filePath = req.file.path;
        const jsonArray = await csv().fromFile(filePath);

        await userSchema.insertMany(jsonArray);

        res.status(200).send('File uploaded and userSchema saved to userSchemabase');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('error occoured');
    }
};


// get all customer data
const getAllCustomerData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limitation = 10;
    const skip = (page - 1) * limitation;

    if (page < 1 || limitation < 1) {
        return res.status(400).send('Page and limitation must be greater than 0');
    }

    try {
        const totalCustomers = await userSchema.countDocuments();
        const customerData = await userSchema.find()
            .skip(skip)
            .limit(limitation)
            .sort({ firstname: -1 });

        return res.status(200).json({
            total: totalCustomers,
            page,
            limitation,
            customerData
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
};

// get one customer
const getoneCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const customerData = await userSchema.findById(id);
        if (!customerData) {
            return res.status(404).send('Customer not found');
        }

        return res.status(200).json(customerData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
};

// Search customers by first name
const searchCustomerByFirstName = async (req, res) => {
    const { firstname } = req.query;
    const limitation = 10;

    if (!firstname) {
        return res.status(400).send('First name query parameter is required');
    }

    try {
        const customerData = await userSchema.find({ firstname: new RegExp(firstname, 'i') }, { firstname: 1, policy_start_date: 1 })
            .limit(limitation)
            .sort({ firstname: -1 });

        return res.status(200).json(customerData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
};

// create Message 
const createMessage = async (req, res) => {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
        return res.status(400).send('All input fields are required');
    }
    try {
        const newMessage = new messageSchema({
            message,
            day,
            time,
        });

        await newMessage.save();

        return res.status(201).send('Message scheduled successfully');
    } catch (error) {
    }
};

// get all message
const getAllmessages = async (req, res) => {
    try {

        const message = await messageSchema.find().sort({ createdAt: -1 })

        if (message?.length > 1) {
            return res.status(201).json(message)
        }
        else if (message?.length < 1) {
            return res.status(200).send("No messages found")
        }
    } catch (error) {
        return res.status(500).send('An error occurred');

    }
}



export { upload, uploadCsv, getAllCustomerData, getoneCustomer, searchCustomerByFirstName, createMessage, getAllmessages };
