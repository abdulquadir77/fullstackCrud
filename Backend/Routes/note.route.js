const express = require("express");

const notesRoute = express.Router();

const NoteModel = require("../Models/note.model");

notesRoute.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find();
    res.send(notes);
  } catch (error) {
    console.log(error);
    console.log("somthing error");
  }
});

notesRoute.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const notes = new NoteModel(payload);
    await notes.save();
    res.send("Notes Created Successfully");
  } catch (error) {
    console.log(error);
    console.log("somthing error in Create");
  }
});

notesRoute.patch("/edit/:noteID", async (req, res) => {
  var userID = req.body.userID;
  var noteID = req.params.noteID;
  var payload = req.body;

  try {
    const notes = await NoteModel.findOne({ _id: noteID });
    if (userID !== notes.userID) {
      res.send("Not Authorized");
    } else {
      await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
      res.send("Notes Edited Successfully");
    }
  } catch (error) {
    console.log(error);
    console.log("somthing error in Edit");
  }
});

notesRoute.delete("/delete/:noteID", async (req, res) => {
  const userID = req.body.userID;
  const noteID = req.params.noteID;
  try {
    const notes = await NoteModel.findOne({ _id: noteID });
    if (userID !== notes.userID) {
      res.send("Not Authorized");
    } else {
      await NoteModel.findByIdAndDelete({ _id: noteID });
      res.send("Notes Deleted Successfully");
    }
  } catch (error) {
    console.log(error);
    console.log("somthing error in Delete");
  }
});

module.exports = notesRoute;
