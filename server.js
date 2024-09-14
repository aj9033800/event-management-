const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eventdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Event schema
const eventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  location: String,
  attendees: [String]
});

const Event = mongoose.model('Event', eventSchema);

// Routes
app.post('/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).send(event);
});

app.get('/events', async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.post('/notify', async (req, res) => {
  const { email, subject, text } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  let info = await transporter.sendMail({
    from: '"Event Manager" <your-email@gmail.com>',
    to: email,
    subject: subject,
    text: text
  });

  res.send('Notification sent');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
