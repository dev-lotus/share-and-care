const express = require('express')
const router = express.Router();
const Request = require('../models/request');

const FreeListing = require('../models/freeListing');
const FreeBorrow = require('../models/freeBorrow');
const FreeWanted = require('../models/freeWanted');

router.post('/add/newRequest', async (req, res) => {
    try {
        const newRequest = new Request({
            listId: req.body.listId,
            listType:req.body.listType,
            listedUserToken: req.body.listedUserToken,
            requesterUserToken: req.body.requesterUserToken,
            request_message: req.body.request_message,
            acceptance_status: req.body.acceptance_status,
            rejection_message: ""
        })

        const r1 = await newRequest.save();
        res.status(200).json(true);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})

// REJECTION MESSAGE
router.patch('/add/rejectionMessage/:id', async (req, res) => {
    try {
        const requestOne = await Request.findOne({
            _id: req.params.id,
        });
        requestOne.rejection_message = req.body.rejection_message;
        requestOne.acceptance_status = req.body.acceptance_status;

        const r1 = await requestOne.save();
        res.status(200).json(true);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})

// ACCEPTANCE
router.patch('/update/acceptanceStatus/:reqId/:listId', async (req, res) => {
    try {
        const requestOne = await Request.findOne({
            _id: req.params.reqId,
        });
        const freeList = await FreeListing.findOne({
            _id:req.params.listId
        });
        const freeBorrow = await FreeBorrow.findOne({
            _id:req.params.listId
        })
        const freeWanted = await FreeWanted.findOne({
            _id:req.params.listId
        })
        if(req.body.listType == 'listing')
        {
            if(req.body.acceptance_status == 'delivered' )
            {
                requestOne.acceptance_status = req.body.acceptance_status;
                freeList.onHold = false;
                freeList.disable = true;
                const r1 = await requestOne.save();
                const f1 = await freeList.save();
            }
            
            else{
                requestOne.acceptance_status = req.body.acceptance_status;
                const r1 = await requestOne.save();
            }
        }
        else if(req.body.listType == 'borrow')
        {
            if(req.body.acceptance_status == 'delivered' )
            {
                requestOne.acceptance_status = req.body.acceptance_status;
                freeBorrow.onHold = false;
                freeBorrow.disable = true;
                const r1 = await requestOne.save();
                const f1 = await freeBorrow.save();
            }
            
            else{
                requestOne.acceptance_status = req.body.acceptance_status;
                const r1 = await requestOne.save();
            }
        }
        else if(req.body.listType == 'wanted')
        {
            if(req.body.acceptance_status == 'delivered' )
            {
                requestOne.acceptance_status = req.body.acceptance_status;
                freeWanted.onHold = false;
                freeWanted.disable = true;
                const r1 = await requestOne.save();
                const f1 = await freeWanted.save();
            }
            
            else{
                requestOne.acceptance_status = req.body.acceptance_status;
                const r1 = await requestOne.save();
            }
        }
       
        
      
        res.status(200).json(true);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})


router.get('/get/allRequest/requested/token/:token1', async (req, res) => {
    try {
        const allRequest = await Request.find({

            requesterUserToken: req.params.token1

        })

        res.status(200).json(allRequest);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})

router.get('/get/allRequest/received_request/token/:token1', async (req, res) => {
    try {
        const allRequest = await Request.find({

            listedUserToken: req.params.token1

        })

        res.status(200).json(allRequest);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})

module.exports = router;