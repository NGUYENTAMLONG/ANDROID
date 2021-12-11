const express = require("express");

const router = express.Router();

const Question = require("../models/Question");

// GET All Questions

router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    if (!questions) throw Error("Not found !!!");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ msg: `${error}` });
  }
});
// *****************************
//POST Question
router.post("/", async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const question = await newQuestion.save();
    if (!question)
      throw Error("Something went wrong while saving the question");
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ msg: `${err}` });
  }
});
// GET Questions by topic
router.get("/:topic", async (req, res) => {
  try {
    const questions = await Question.find()
      .where("topic")
      .in(req.params.topic)
      .exec();
    if (!questions) throw Error("Not found !!!");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ msg: `${error}` });
  }
});
//DELETE Question
router.delete("/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, msg: "Successfully deleted !!!" });
  } catch (error) {
    res.status(400).json({ msg: `${error}` });
  }
});
// UPDATE question
router.patch("/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body);
    if (!question) throw Error("Something went wrong while updating the post!");
    res.status(200).json({ success: "Update successful !!!" });
  } catch (error) {
    res.status(500).json({ msg: `${err}` });
  }
});
// GET question by id
router.get("/getDetail/:id", async (req, res) => {
  try {
    // const question = await Question.find()
    //   .where("_id")
    //   .in(req.params.id)
    //   .exec();
    const question = await Question.findById(req.params.id);
    if (!question) throw Error("Not Question Found !!!");
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ msg: `${err}` });
  }
});

// Paging api question

module.exports = router;
