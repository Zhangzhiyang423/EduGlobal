document.addEventListener('DOMContentLoaded', function () {
    const programFilter = document.getElementById('programFilter');
    const articles = {
        "information-systems": document.getElementById('information-systems-articles'),
        "software-engineering": document.getElementById('software-engineering-articles'),
        "artificial-intelligence": document.getElementById('artificial-intelligence-articles'),
    };

    programFilter.addEventListener('change', function () {
        // Hide all articles first
        for (let key in articles) {
            articles[key].style.display = "none";
        }

        const selectedProgram = programFilter.value;
        
        if (selectedProgram && articles[selectedProgram]) {
            // Display articles related to the selected program
            articles[selectedProgram].style.display = "block";
        }
    });
});
