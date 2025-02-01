document.getElementById('fetchAssignments').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: fetchAssignments
      });
    });
  });
  
  function fetchAssignments() {
    // Implement logic to fetch assignments
    console.log('Fetching assignments...');
  }