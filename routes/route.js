import express from 'express';
import { createAgent, createCategory, createMessage, getAllAgents, getAllCategory, getAllCustomerData, getAllmessages, getoneCustomer, getAggregatedPolicies, searchCustomerByFirstName, upload, uploadCsv } from '../controllers/controller.js';

const router = express.Router();

router.post('/uploadcsv', upload.single('file'), uploadCsv);
router.post('/get_all_customer_data', getAllCustomerData);
router.post('/get_one_customer/:id', getoneCustomer);
router.post('/search_customer', searchCustomerByFirstName);
router.post('/create_message', createMessage);
router.post('/get_all_messages', getAllmessages);
router.post('/create_category', createCategory);
router.post('/create_agent', createAgent);
router.post('/get_all_agents', getAllAgents);
router.post('/get_Aggregated_Policies', getAggregatedPolicies);


export default router;
