const express = require('express');
const router = express.Router();
const FreeListing = require('../models/freeListing');
const User = require('../models/user');
const Request = require('../models/request');
// GET ALL FREE LISTING 

router.get('/get/freeListing/', async (req, res) => {
    try {
        const allList = await FreeListing.find();
        res.status(200).json(allList);
    } catch (err) {
        res.status(502).send('Error ' + err);
    }
});

// GET LISTING BY USER TOKEN

router.get('/get/freeListing/userToken/:id', async (req, res) => {
    try {
        const allList = await FreeListing.find({
            userToken: req.params.id
        });
        res.status(200).json(allList);
    } catch (err) {
        res.status(502).send('Error ' + err);
    }
});

// GET LISTING BY LISTING ID

router.get('/get/freeListing/listingId/:listId/:userToken', async (req, res) => {
    try {
        const list = await FreeListing.find({
            _id: req.params.listId,
            userToken: req.params.userToken
        });

        res.status(200).json(list);
    } catch (err) {
        res.status(502).send('Error ' + err);
    }
});

router.get('/get/listings/nearBy/:lng/:lat', async (req, res) => {
    try {

       const longitude = Number(req.params.lng);
        const latitude = Number(req.params.lat);
       const find_nearBy= await FreeListing.find({
        location:{
            $near:{
                $geometry:{
                    type:"Point",
                    coordinates:[
                        longitude,
                        latitude
                    ]
                },
              
                $maxDistance : 25000,
                
            }
        }
       })
       

        res.status(200).json(find_nearBy);
    } catch (err) {
        res.status(502).send('Error ' + err);
    }
})

// ADD FREE LISTING
router.post('/add/freeListing', async (req, res) => {

    try {
        const freeList = new FreeListing({
            userToken: req.body.userToken,
            picture: req.body.picture,
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            pickUpTime: req.body.pickUpTime,
            listFor: req.body.listFor,
            location: { "lng": req.body.lng, "lat": req.body.lat }
        })

        const f1 = await freeList.save();
        res.status(200).json(true);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
});

// UPDATE FREE LISTING ITEM

router.put('/update/freeListing/:listId/:userToken', async (req, res) => {
    try {
        const freeList = await FreeListing.findOne({
            _id: req.params.listId,
            userToken: req.params.userToken
        });
        freeList.picture = req.body.picture;
        freeList.title = req.body.title;
        freeList.category = req.body.category;
        freeList.description = req.body.description;
        freeList.pickUpTime = req.body.pickUpTime;
        freeList.listFor = req.body.listFor;
        freeList.location = { "lng": req.body.lng, "lat": req.body.lat };

        const u1 = await freeList.save();
        console.log(u1);
        res.status(200).json(true);
    } catch (err) {
        res.status(502).send('Error ' + err);
    }
});

//  UPDATE FREE LISTING  PICTURE
router.patch('/update/freeListingPicture/:listId/:userToken', async (req, res) => {
    try {
        const freeList = await FreeListing.find({
            _id: req.params.listId,
            userToken: req.params.userToken
        });
        freeList.picture = req.body.picture;
        const l1 = await freeList.save();

        res.status(200).json(true);

    } catch (err) {
        res.status(502).send('Error ' + err);
    }

});

// ON HOLD
router.patch('/update/onHoldListing/:id', async (req, res) => {
    try {
        const list = await FreeListing.findOne({
            _id: req.params.id,
        });
        list.onHold = req.body.onHold;

        const l1 = await list.save();
        res.status(200).json(true);

    } catch (err) {
        res.status(200).send('Error ' + err);
    }
})


//  DISBALE LISTING VIEW STATUS
router.patch('/update/disableStatusFreeListing/:listId/:userToken', async (req, res) => {
    try {
        const freeList = await FreeListing.findOne({
            _id: req.params.listId,
            userToken: req.params.userToken
        });
        freeList.disable = req.body.disableStatus;
        const l1 = await freeList.save();

        res.status(200).json(true);

    } catch (err) {
        res.status(502).send('Error ' + err);
    }

});

//  UPDATE ADD LIKE TO LISTING
router.patch('/update/addLikeFreeListing/:listId', async (req, res) => {
    try {
        const freeList = await FreeListing.findByIdAndUpdate(req.params.listId,

            { $push: { likes: { "listId": req.params.listId, "userToken": req.body.userToken } } },

            { 'upsert': true });

        const l1 = await freeList.save();

        res.status(200).json(true);

    } catch (err) {
        res.status(502).send('Error ' + err);
    }

});

// REMOVE LIKE FROM LISTING
router.patch('/update/removeLikeFreeListing/:listId', async (req, res) => {
    try {
        const freeList = await FreeListing.findByIdAndUpdate(req.params.listId,

            { $pull: { likes: { "listId": req.params.listId, "userToken": req.body.userToken } } });

        const l1 = await freeList.save();

        res.status(200).json(true);

    } catch (err) {
        res.status(502).send('Error ' + err);
    }

});

// DELETE FREE LISTING 
router.delete('/delete/freeListing/:listId/:userToken', async (req, res) => {
    try {
        const freeList = await FreeListing.findOne({
            _id: req.params.listId,
            userToken: req.params.userToken
        });

        const requestOne = await Request.findOne({
            listId: req.params.listId,
            listedUserToken: req.params.userToken
        });

        const f1 = await freeList.remove();
        const r1 = await requestOne.remove();
        res.status(200).json(true);

    } catch (err) {
        res.status(200).json('Error ' + err);
    }
})

module.exports = router;