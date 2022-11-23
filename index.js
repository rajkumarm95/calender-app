const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();
const app = express();
app.use(express.json());


const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2oKJ0sDrxT7X6\n8diINr84hlD3dnr2x2v6HWE3TyORduxQMgKU5PstOCqQ90wV9Py7xf8JVkdfFTcb\nmEPOUG8IYy3LERI1ypdqPcThYkqwwjFqtLV57SI2sgY2o8r8R1wnLsnfafAF9RkE\nBS5HKecEaP4RNxHS/1nn7MUO1LQHuiL6ZdfIbbDjWuWLsc8YhmlAcO+D5eDqYoye\noGebm6iuc0YS/dF0BMZrrCjX5oou66SYTVJmpbsS2wfzO6MBpXfhneW+as5rd3Zp\nvBhfmEUPq3j2E8RWCL9s4KGBkPvELrLLc7AcaSXjJ//AaWnAkY8Ox7rMrEw05nkm\njR4H3FEhAgMBAAECggEALD5MPSK4lN9vweS3RYCl4MbBdMISVhjH8ucNNz4H6uS5\nqVAEShgTNchGn6oZl7QrSj5UY+mwDrvwBtJjkubvj0Ofw3NWSwvSlN10BfovCBVz\nrVssH+awBDoqwS/7LBUJoUB3jZV3nancLpomtPzUx7+71WXW/pv4JvS4ZLhpCPnI\nQBxhn8O4BqYnNbic6nOVuISunrV3ZB18ZOeDZFQPoYigEKIieVYVcidlf8ZjTeIu\nuk8GI3y+Azn0pgNJJ58IoA9Oq6Mm5SI2iZDc6aBtVXoNLs6eG+2C2G+pKPtxVGpb\n61+n4VPhuZ0fdZnKHw91uIQTJuw/ky0R9aThwzG/lQKBgQD6JLWQt4xatSIqsBil\nT0KTXbcFsjl3a4jRcF0Q8idkWTp/KREcyATc7QPlr6Fe8uXBUYq2uInghVQPSxPq\nvzuRgo0NlkSi8Roue48A87RqDVJCzPUUFvdKLt5gFxJhnY5f277gHvMwiVrSGVNb\n5Uo2P32raf8oCihrqxqpPmAGVwKBgQC650DlyavbW8TVTZj1n8k+B1IzrTMgSIwJ\nqnODGiMdoDXM8KEEp7vjfij0BKd5sHI7HJ291qmXYYaFmMpDO7gc+07YZksujZUX\nXlwyrd0h6GH47JPg8rH1nzpjt6dwaIOFbLz/1IKAgjXm+EAHfXGtAmfQa+SNIIaJ\nJDP0BRqJRwKBgBOz1IFDk9CJN9m46RgMOCg3V3UhZplbZPlqKkptaGDlDlB5wZlM\nv+VO3eG3hbRe2W3yqERgIKwIlGhn93ej/GMnr0iEr39OEkva+5aNm4ZG6lXMovkk\nHfI/4tAawR3jNRWjz1MD3Q/Toc2upPw2ATRop9Nak/hpZGmmnoD6IsIdAoGADt9e\nA6sDmOX5iLuvA0Sev+fXO7N5kQUU16QPowwOZUodXdx8A6HRSq38VkaUiRNoU5nY\nV4XgYuJo0PKyjZ0P7oZ05LVnICI2DfD9Ry8cnJkgSq2QquLFFHWCMPMpSMGYTaK0\ne2sOo2k5HtL8TVxHEmxRlH0xZ6WB7yHJXI6XaPsCgYBXjfbIKOuFIOR9UmNnGOhA\nGsIIIL+zcj2BXDS+Y4tZMogSfLKerDqSD30VSS4HSQK7Wfj+H8XaPy8UShoqkMnf\nPJ5wjvohyJ90FC3tkEnnd7qnBLvP5ylupCl6SxVMnTgUUSZJm4qXiEcIqYFbj/CJ\n5k2miTeScI7CKDll/2oQSA==\n-----END PRIVATE KEY-----\n";
const GOOGLE_CLIENT_EMAIL = "calender-node-js-rd@carbon-bonsai-369507.iam.gserviceaccount.com";
const GOOGLE_PROJECT_NUMBER = "897718412900";
const GOOGLE_CALENDAR_ID = "6c6098f86c0cbe23ee834a42a07791a03ee8c6975179f9b29f677999f1da6fe9@group.calendar.google.com";

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
