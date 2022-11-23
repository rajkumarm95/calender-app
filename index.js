const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();
const app = express();
app.use(express.json());


const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_PRIVATE_KEY = "<GOOGLE_PRIVATE_KEY>";
const GOOGLE_CLIENT_EMAIL = "<GOOGLE_CLIENT_EMAIL>";
const GOOGLE_PROJECT_NUMBER = "<GOOGLE_PROJECT_NUMBER>";
const GOOGLE_CALENDAR_ID = "<GOOGLE_CALENDAR_ID>";

/**
 * jwtClient - read only access
 */
const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

/**
 * configuring calender
 */
const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

/**
 * get api to fetch all event
 */
app.get("/", (req, res) => {
  calendar.events.list(
    {
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (error, result) => {
      if (error) {
        res.send({ error: error });
      } else {
        if (result.data.items.length) {
          res.json({ events: result.data.items });
        } else {
          res.json({ message: "No upcoming events found." });
        }
      }
    }
  );
});
/**
 * auth -  edit access
 */
const auth = new google.auth.GoogleAuth({
    keyFile: "carbon-bonsai-369507-6230724b2123.json", // rovide the file path of JSON from google
    scopes: "https://www.googleapis.com/auth/calendar", //full access to edit calendar
});

/**
 * create api
 */
app.get('/createEvent', (req, res)=>{
  const {startDate} = req.body;
  const {endDate} = req.body;
  console.log({ startDate, endDate });
  /* create event data */
  var event = {
    summary: "My first event!",
    location: "Hyderabad,India",
    description: "First event with nodeJS!",
    start: {
      dateTime: startDate,
      timeZone: "Asia/Dhaka",
    },
    end: {
      dateTime: endDate,
      timeZone: "Asia/Dhaka",
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  /* freebusy to find the sloot is free */
  calendar.freebusy.query(
    {
      resource: {
        timeMin: startDate,
        timeMax: endDate,
        timeZone: "Asia/Kolkata",
        items: [{ id: GOOGLE_CALENDAR_ID }],
      },
    },
    (err, data) => {
      if (err) return console.error("Free Busy Query Error:", err);
      const eventArr = data.data.calendars[GOOGLE_CALENDAR_ID].busy;
      if (eventArr.length === 0) {
        auth.getClient().then((a) => {
          calendar.events.insert(
            {
              auth: a,
              calendarId: GOOGLE_CALENDAR_ID,
              resource: event,
            },
            function (err, event) {
              if (err) {
                console.log(
                  "There was an error contacting the Calendar service: " + err
                );
                return;
              }
              console.log("Event created: %s", event.data);
              res.json({
                mess: "Event successfully created!",
                res: event.data,
              });
            }
          );
        });
      } else {
        res.json({mess : "meeting room not avilable"});
      }
    }
  );
})

app.listen(3000, () => console.log(`App listening on port 3000!`));
