const express = require("express");
const Comment = require("../models/comment");
const authenticate = require('../authenticate');

const commentRouter = express.Router();


commentRouter
  .route("/")
  .get((req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(comments);
        } else {
          err = new Error(`comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser,(req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment) {
          comment.comments.push(req.body);
          comment
            .save()
            .then((comment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(comment);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /comments/${req.params.commentId}/comments`
    );
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment) {
          for (let i = comment.comments.length - 1; i >= 0; i--) {
            comment.comments.id(comment.comments[i]._id).remove();
          }
          comment
            .save()
            .then((comment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(comment);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

commentRouter
  .route("/:commentId")
  .get((req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment && comment.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(comment.comments.id(req.params.commentId));
        } else if (!comment) {
          err = new Error(`comment ${req.params.commentId} not found`);
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
  .post(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /comments/${req.params.commentId}/comments/${req.params.commentId}`
    );
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment && comment.comments.id(req.params.commentId)) {
          if (req.body.rating) {
            comment.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.text) {
            comment.comments.id(req.params.commentId).text = req.body.text;
          }
          comment
            .save()
            .then((comment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(comment);
            })
            .catch((err) => next(err));
        } else if (!comment) {
          err = new Error(`comment ${req.params.commentId} not found`);
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
  .delete(authenticate.verifyUser,(req, res, next) => {
    comment.findById(req.params.commentId)
      .then((comment) => {
        if (comment && comment.comments.id(req.params.commentId)) {
          comment.comments.id(req.params.commentId).remove();
          comment
            .save()
            .then((comment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(comment);
            })
            .catch((err) => next(err));
        } else if (!comment) {
          err = new Error(`comment ${req.params.commentId} not found`);
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
