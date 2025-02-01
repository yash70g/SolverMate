// Fetch assignments from Google Classroom
async function fetchAssignments() {
    try {
      const response = await fetch('http://localhost:5000/api/fetch-assignments');
      const data = await response.json();
      console.log('Assignments fetched:', data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }
  
  fetchAssignments();