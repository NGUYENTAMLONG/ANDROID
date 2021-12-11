const express = require("express");

const router = express.Router();

const Question = require("../models/Question");

router.get("/", handlePaging(Question), (req, res) => {
  res.json(res.handlePaging);
});
function handlePaging(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startPage = (page - 1) * limit;
    const endPage = page * limit;

    const result = {};
    if (startPage > 0) {
      result.previous = {
        previousPage: page - 1,
        limit: limit,
      };
    }
    if (endPage < (await model.countDocuments().exec())) {
      result.next = {
        nextPage: page + 1,
        limit: limit,
      };
    }
    try {
      result.resultPage = await model
        .find()
        .limit(limit)
        .skip(startPage)
        .exec();
      res.handlePaging = result;
      next();
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
}

module.exports = router;
