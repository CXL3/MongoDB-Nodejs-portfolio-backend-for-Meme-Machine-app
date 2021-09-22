const express = require('express');
const Meme = require('../models/meme');
const authenticate = require('../authenticate');

const memeRouter = express.Router();


memeRouter.route('/')
.get((req, res, next) => {
    Meme.find()
    .then(memes => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(memes);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Meme.create(req.body)
    .then(meme => {
        console.log('Meme Created ', meme);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meme);
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /memes');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Meme.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

memeRouter.route('/:memeId')
.get((req, res, next) => {
    Meme.findById(req.params.memeId)
    .then(meme => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meme);
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /memes/${req.params.memeId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Meme.findByIdAndUpdate(req.params.memeId, {
        $set: req.body
    }, { new: true })
    .then(meme => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(meme);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Meme.findByIdAndDelete(req.params.memeId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = memeRouter;

