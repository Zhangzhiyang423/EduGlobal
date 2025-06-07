// Function to handle form submission and redirect to "Add Comment Done" page
function submitForm() {
    // Assuming the form has been filled and is ready to be submitted
    // Redirect to the "Add Comment Done" page
    window.location.href = "add-comment-done.html";  // Redirect to the "Add Comment Done" page
}

// Attach the function to the button click event
document.getElementById("commentForm").onsubmit = function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    submitForm(); // Call the submitForm function
};
