const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const firebase = require("firebase");

var firebaseConfig = {
  apiKey: "AIzaSyA6bVMUwVZ6XjD3r-c6H-bQ98v7XOT1P_w",
  authDomain: "socialape-454be.firebaseapp.com",
  databaseURL: "https://socialape-454be.firebaseio.com",
  projectId: "socialape-454be",
  storageBucket: "socialape-454be.appspot.com",
  messagingSenderId: "591094817889",
  appId: "1:591094817889:web:99063391dd0f2b4fa37620",
  measurementId: "G-GPQR6J424E",
};

admin.initializeApp();
firebase.initializeApp(firebaseConfig);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(400).json({ error: "something went wrong" });
      console.error(err);
    });
});

//signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  // TODO: validate data

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signedup successfully ` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.https.onRequest(app);
