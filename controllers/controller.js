import multer from 'multer';
import csv from 'csvtojson';
import policySchema from '../models/usersSchema.js';
import messageSchema from '../models/messageSchema.js';
import categorySchema from '../models/categorySchema.js';
import agentSchema from '../models/AgentSchema.js';
import usersDataSchema from '../models/usersDataSchema.js';
import PolicyInfo from '../models/policySchema.js';
import companySchema from '../models/companySchema.js';
import accountSchema from '../models/usersAccount.js';
// import policySchema from '../models/usersSchema.js'; 

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
        console.log('File upload request received.');

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).send('No file uploaded');
        }

        const filePath = req.file.path;
        console.log('File path:', filePath);

        const jsonArray = await csv().fromFile(filePath);

        // Clear the existing policy data and insert the new data
        await policySchema.deleteMany({});
        await policySchema.insertMany(jsonArray);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(jsonArray.map(item => item.category_name)));
        // Upsert each unique category
        const categoryOperations = uniqueCategories.map(categoryName => ({
            updateOne: {
                filter: { category: categoryName },
                update: { $setOnInsert: { category: categoryName } },
                upsert: true
            }
        }));
        await categorySchema.bulkWrite(categoryOperations);

        // Extract unique agents
        const uniqueAgents = Array.from(new Set(jsonArray.map(item => item.agent)));
        // Upsert each unique agent
        const agentOperations = uniqueAgents.map(agentName => ({
            updateOne: {
                filter: { agentName: agentName },
                update: { $setOnInsert: { agentName: agentName } },
                upsert: true
            }
        }));
        await agentSchema.bulkWrite(agentOperations);

        // Extract unique companies
        const uniqueCompanies = Array.from(new Set(jsonArray.map(item => item.company_name)));
        // Upsert each unique company
        const companyOperations = uniqueCompanies.map(companyName => ({
            updateOne: {
                filter: { company_name: companyName },
                update: { $setOnInsert: { company_name: companyName } },
                upsert: true
            }
        }));
        await companySchema.bulkWrite(companyOperations);

        // Extract unique users and upsert them
        const uniqueUsers = jsonArray.map(item => ({
            firstName: item.firstname,
            dob: new Date(item.dob),
            address: item.address,
            phoneNumber: item.phone,
            state: item.state,
            zipCode: item.zip,
            email: item.email,
            gender: item.gender,
            userType: item.userType
        }));

        const userOperations = uniqueUsers.map(userData => ({
            updateOne: {
                filter: { email: userData.email },
                update: { $setOnInsert: userData },
                upsert: true
            }
        }));
        await usersDataSchema.bulkWrite(userOperations);

        // Extract unique account names
        const uniqueAccounts = Array.from(new Set(jsonArray.map(item => item.account_name)));
        // Upsert each unique account
        const accountOperations = uniqueAccounts.map(accountName => ({
            updateOne: {
                filter: { account_name: accountName },
                update: { $setOnInsert: { account_name: accountName } },
                upsert: true
            }
        }));
        await accountSchema.bulkWrite(accountOperations);

        // Extract and insert policy information
        const policyInfoOperations = await Promise.all(jsonArray.map(async item => {
            const category = await categorySchema.findOne({ category: item.category_name });
            const user = await usersDataSchema.findOne({ email: item.email });
            const company = await companySchema.findOne({ company_name: item.company_name });
            const account = await accountSchema.findOne({ account_name: item.account_name });

            if (category && user && company && account) {
                return {
                    updateOne: {
                        filter: { policy_number: item.policy_number },
                        update: {
                            policy_number: item.policy_number,
                            policy_start_date: new Date(item.policy_start_date),
                            policy_end_date: new Date(item.policy_end_date),
                            policy_category: category._id,
                            company: company._id,
                            user: user._id,
                            user_account: account._id // Assuming you've added user_account to policyInfoSchema
                        },
                        upsert: true
                    }
                };
            }
            return null;
        }));

        // Filter out null operations and execute bulkWrite
        await PolicyInfo.bulkWrite(policyInfoOperations.filter(op => op !== null));

        res.status(200).send('File uploaded and data saved to database');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
};


const createCategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).send('category is required');
    }
    try {
        const findCategory = await categorySchema.find({ category })

        if (findCategory?.length) {
            return res.status(200).send("category already exists")
        }

        const categoryData = await categorySchema.create({ category });
        return res.status(201).json(categoryData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
}

const getAllCategory = async (req, res) => {
    try {
        const categoryData = await categorySchema.find();
        return res.status(200).json(categoryData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
}

const createAgent = async (req, res) => {
    const { agentName } = req.body;

    if (!agentName) {
        return res.status(400).send('agent name is required');
    }
    try {
        const findAgent = await agentSchema.find({ agent: agentName })

        if (findAgent?.length) {
            return res.status(200).send("agent already exists")
        }

        const agentData = await agentSchema.create({ agentName });
        return res.status(201).json(agentData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
}

const getAllAgents = async (req, res) => {
    try {
        const agentData = await agentSchema.find();
        return res.status(200).json(agentData);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('error occoured');
    }
}

// get all customer data
const getAllCustomerData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limitation = 10;
    const skip = (page - 1) * limitation;

    if (page < 1 || limitation < 1) {
        return res.status(400).send('Page and limitation must be greater than 0');
    }

    try {
        const totalCustomers = await policySchema.countDocuments();
        const customerData = await policySchema.find()
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
        const customerData = await policySchema.findById(id);
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
        const customerData = await policySchema.find({ firstname: new RegExp(firstname, 'i') }, { firstname: 1, policy_end_date: 1 })
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

// get aggregated policies 
const getAggregatedPolicies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to limit 10
        const skip = (page - 1) * limit;

        const aggregatedData = await policySchema.aggregate([
            {
                $lookup: {
                    from: 'policies', // The collection name in MongoDB
                    localField: 'email', // Match email field
                    foreignField: 'email',
                    as: 'policies'
                }
            },
            {
                $addFields: {
                    policyNames: {
                        $map: {
                            input: '$policies',
                            as: 'policy',
                            in: '$$policy.policy_number' // Assuming policy_number is the name identifier
                        }
                    },
                    totalPremium: {
                        $sum: {
                            $map: {
                                input: '$policies',
                                as: 'policy',
                                in: { $toDouble: { $ifNull: ['$$policy.premium_amount', '0'] } }
                            }
                        }
                    },
                    policyCount: { $size: '$policies' }
                }
            },
            {
                $match: {
                    policyCount: { $gt: 0 } // Only include users with policies
                }
            },
            {
                $project: {
                    _id: 1,
                    firstname: 1,
                    dob: 1,
                    address: 1,
                    phone: 1,
                    state: 1,
                    email: 1,
                    gender: 1,
                    userType: 1,
                    policyNames: 1,
                    totalPremium: 1,
                    policyCount: 1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        res.json(aggregatedData);
    } catch (error) {
        console.error('Error fetching aggregated data:', error);
        res.status(500).send('Internal Server Error');
    }
};




export {
    upload,
    uploadCsv, getAllAgents, getAggregatedPolicies,
    createCategory, getAllCustomerData, getoneCustomer, searchCustomerByFirstName, createMessage, getAllmessages, getAllCategory, createAgent
};
