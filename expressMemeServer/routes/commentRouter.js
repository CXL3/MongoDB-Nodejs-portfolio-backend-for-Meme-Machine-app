const express = require("express");
const Comment = require("../models/comment");
const authenticate = require("../authenticate");
const cors = require("./cors");

const commentRouter = express.Router();

commentRouter
  .route("/")
  .get((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(meme.comments);
        } else {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme) {
          meme.comments.push(req.body);
          meme
            .save()
            .then((meme) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(meme);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /memes/${req.params.memeId}/comments`
    );
  })
  .delete((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme) {
          for (let i = meme.comments.length - 1; i >= 0; i--) {
            meme.comments.id(meme.comments[i]._id).remove();
          }
          meme
            .save()
            .then((meme) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(meme);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

commentRouter
  .route("/:commentId")
  .get((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme && meme.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(meme.comments.id(req.params.commentId));
        } else if (!meme) {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /memes/${req.params.memeId}/comments/${req.params.commentId}`
    );
  })
  .put((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme && meme.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            meme.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            meme.comments.id(req.params.commentId).text = req.body.text;
          }
          meme
            .save()
            .then((meme) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(meme);
            })
            .catch((err) => next(err));
        } else if (!meme) {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Meme.findById(req.params.memeId)
      .then((meme) => {
        if (meme && meme.comments.id(req.params.commentId)) {
          meme.comments.id(req.params.commentId).remove();
          meme
            .save()
            .then((meme) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(meme);
            })
            .catch((err) => next(err));
        } else if (!meme) {
          err = new Error(`Meme ${req.params.memeId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = commentRouter;
