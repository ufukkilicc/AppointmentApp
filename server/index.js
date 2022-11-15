const mongo = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

const months_string = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

mongo.connect("mongodb://127.0.0.1/appointmentapp", function (err, db) {
  if (err) {
    throw err;
  }
  console.log("Mongodb connected");

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    let appointments = db.collection("appointments");

    appointments
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }

        socket.emit("appointments", res);
      });

    socket.on("input", async function (data) {
      let date = data.date - 2;
      let year = data.year;
      let month = months_string.indexOf(data.month);
      let hour = data.hour;
      let DATE = new Date();
      DATE.setDate(date);
      DATE.setFullYear(year);
      DATE.setMonth(month);
      DATE.setHours(hour + 3);
      DATE.setMinutes(0);
      DATE.setSeconds(0);
      const appointment = await appointments.findOne({
        date: DATE.toUTCString(),
      });
      if (appointment !== null) {
        socket.emit("status", { message: "Appointment Already Exists." });
      } else {
        appointments.insert(
          { date: DATE.toUTCString(), reserved: false },
          function (err, newDoc) {
            socket.emit("status", { message: "Appointment Created." });
            socket.emit("output", newDoc.ops[0]);
            socket.broadcast.emit("created_appointment", newDoc.ops[0]);
          }
        );
      }
    });
    socket.on("reserve", async function (data) {
      let date = data.date - 2;
      let year = data.year;
      let month = months_string.indexOf(data.month);
      let hour = data.hour;
      let DATE = new Date();
      DATE.setDate(date);
      DATE.setFullYear(year);
      DATE.setMonth(month);
      DATE.setHours(hour + 3);
      DATE.setMinutes(0);
      DATE.setSeconds(0);
      const appointment = await appointments.findOne({
        date: DATE.toUTCString(),
      });
      if (appointment === null) {
        socket.emit("status", { message: "No Appointment Here." });
      } else {
        if (appointment.reserved === true) {
          socket.emit("status", { message: "This Appointment Unavailable" });
        } else {
          appointments.findOneAndUpdate(
            { date: DATE.toUTCString() },
            {
              $set: { reserved: true },
            },
            { returnOriginal: false },
            function (err, newDoc) {
              if (err) throw err;
              socket.emit("status", { message: "Appointment Reserved." });
              socket.emit("update", newDoc.value);
              socket.broadcast.emit("reserved_appointment", newDoc.value);
            }
          );
        }
      }
    });
  });
});

server.listen(4000, () => "Server is running on port 4000");
