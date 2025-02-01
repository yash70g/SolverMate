const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const Assignment = require('../models/Assignment');

// Authenticate with Google Classroom API
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/auth/google/callback'
);

// Fetch assignments from Google Classroom
router.get('/fetch-assignments', async (req, res) => {
  try {
    // Replace with a valid access token (you'll need to implement OAuth flow)
    const accessToken = req.query.accessToken;
    oauth2Client.setCredentials({ access_token: accessToken });

    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    // Fetch all courses
    const coursesResponse = await classroom.courses.list();
    const courses = coursesResponse.data.courses;

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found.' });
    }

    // Fetch assignments for each course
    for (const course of courses) {
      const courseWorkResponse = await classroom.courses.courseWork.list({
        courseId: course.id,
      });

      const assignments = courseWorkResponse.data.courseWork || [];

      // Save assignments to MongoDB
      for (const assignment of assignments) {
        const newAssignment = new Assignment({
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          courseId: course.id,
        });
        await newAssignment.save();
      }
    }

    res.status(200).json({ message: 'Assignments fetched and saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching assignments.', error: error.message });
  }
});

module.exports = router;