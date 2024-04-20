/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();


const app = express();

// users
app.get("/show", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();

  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(users));
});


// books
app.get("/read", async (req, res) => {
  const snapshot = await admin.firestore().collection("books").get();

  const books = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    books.push({id, ...data});
  });
  res.status(200).send(JSON.stringify(books));
});

// user
app.get("/:id", async (req, res)=>{
  const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

// book
app.get("/:id", async (req, res)=>{
  const snapshot = await admin.firestore().collection("books").doc(req.params.id).get();

  const bookId = snapshot.id;
  const bookData = snapshot.data();

  res.status(200).send(JSON.stringify({id: bookId, ...bookData}));
});

// user
app.post("/register", async (req, res) => {
  const user = req.body;
  await admin.firestore().collection("users").add(user);
  res.status(201).send("User Registered Successfully");
});

// book
app.post("/input", async (req, res) => {
  const book = req.body;
  await admin.firestore().collection("books").add(book);
  res.status(201).send("Book Inputed Successfully");
});

exports.user = functions.https.onRequest(app);
exports.book = functions.https.onRequest(app);

