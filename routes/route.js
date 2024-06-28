import express from 'express';
import { createMessage, getAllCustomerData, getAllmessages, getoneCustomer, searchCustomerByFirstName, upload, uploadCsv } from '../controllers/controller.js';

const router = express.Router();

router.post('/uploadcsv', upload.single('file'), uploadCsv);
router.post('/get_all_customer_data', getAllCustomerData);
router.post('/get_one_customer/:id', getoneCustomer);
router.post('/search_customer', searchCustomerByFirstName);
router.post('/create_message', createMessage);
router.post('/get_all_messages', getAllmessages);


export default router;
