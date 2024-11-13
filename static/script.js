// Initialize an object to store the survey responses
let surveyData = {
    watery_stool: null,
    fever: null,
    abdominal_cramps: null,
    fatigue: null,
    rice_water_stool: null,
    dehydration: null,
    leg_cramps: null,
    vomiting: null,
    rapid_heart_rate: null

};

// Function to handle the selection of Yes or No
function handleSelection(question, value) {
    // Update the corresponding question value in the object
    surveyData[question] = value;
    console.log(surveyData); // Log the updated survey data (for debugging purposes)
}

// Add event listeners to all Yes and No buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function () {
        let question = this.closest('.question').getAttribute('data-question'); // Get the related question key
        let value = this.getAttribute('data-value'); // Get the button value (1 for Yes, 0 for No)

        handleSelection(question, value); // Update the selection in the surveyData object

        // Highlight the selected button by adding 'active' class and removing it from the other
        let buttons = this.closest('.options').querySelectorAll('.btn');
        buttons.forEach(btn => btn.classList.remove('active')); // Remove 'active' from all buttons
        this.classList.add('active'); // Add 'active' to the clicked button
    });
});

// Function to navigate to the next page
function nextPage(pageNumber) {
    const currentPage = document.querySelector('.page:not([style*="display: none"])');
    currentPage.style.display = 'none'; // Hide the current page
    document.getElementById(`page${pageNumber}`).style.display = 'block'; // Show the next page
}

// Function to navigate to the previous page
function prevPage(pageNumber) {
    const currentPage = document.querySelector('.page:not([style*="display: none"])');
    currentPage.style.display = 'none'; // Hide the current page
    document.getElementById(`page${pageNumber}`).style.display = 'block'; // Show the previous page
}

// Function to submit the survey
// Function to submit the survey
function submitSurvey() {
    // Check if all questions have been answered
    for (const key in surveyData) {
        if (surveyData[key] === null) {
            alert(`Please answer the question about ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
            return; // Stop submission if any question is unanswered
        }
    }

    // Log the survey data (for demonstration purposes)
    console.log("Survey submitted with data:", surveyData);

    // Send the data to the Flask backend
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData) // Convert surveyData to JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("Prediction received:", data.prediction);
        // Here you can handle the prediction result (e.g., display it to the user)
    })
    .catch(error => {
        console.error("Error sending survey data:", error);
    });
}

function showResultPage(prediction) {
    // Hide the current survey page
    const currentPage = document.querySelector('.page:not([style*="display: none"])');
    currentPage.style.display = 'none';

    // Display the result page
    const resultPage = document.getElementById('resultPage');
    resultPage.style.display = 'block';

    // Display the prediction result on the page
    const resultElement = document.getElementById('result');
    resultElement.textContent = `The predicted condition is: ${prediction}`;
}
function submitSurvey() {
    // Check if all questions have been answered
    for (const key in surveyData) {
        if (surveyData[key] === null) {
            alert(`Please answer the question about ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
            return; // Stop submission if any question is unanswered
        }
    }

    // Log the survey data (for demonstration purposes)
    console.log("Survey submitted with data:", surveyData);

    // Send the data to the Flask backend for prediction and save it
    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData) // Convert surveyData to JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("Prediction received:", data.prediction);
        
        // Navigate to the result page and display the prediction
        showResultPage(data.prediction);

        // Save survey data on the backend
        saveSurveyData(surveyData, data.prediction);
    })
    .catch(error => {
        console.error("Error sending survey data:", error);
    });
}


// Function to save the survey data to the backend
function saveSurveyData(surveyData, prediction) {
    // Attach the prediction to the survey data
    surveyData.prediction = prediction;

    // Send the survey data to the backend for saving
    fetch('http://127.0.0.1:5000/save_survey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(surveyData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Survey data saved successfully:", data);
    })
    .catch(error => {
        console.error("Error saving survey data:", error);
    });
}
function showResultPage(prediction) {
    // Hide the current survey page
    const currentPage = document.querySelector('.page:not([style*="display: none"])');
    currentPage.style.display = 'none';

    // Display the result page
    const resultPage = document.getElementById('resultPage');
    resultPage.style.display = 'block';

    // Determine the condition based on the prediction value
    let condition;
    let firstAid;
    let medicine;

    if (prediction === 1) {
        condition = "Diarrhea";
        firstAid = "1. ORS for dehydration <br> 2. Laxatives <br> 3. Loperamide";
        medicine = `
            Drink plenty of water and other electrolyte-balanced fluids.<br>
            Choose foods that can firm your stools.<br>
            Avoid caffeine and alcohol.<br>
            Avoid foods and drinks that give you gas.
        `;
    } else {
        condition = "Cholera";
        firstAid = "1.DrinK ORS 2.Contact doctor immediately";
        medicine = "Antibiotics like Doxycycline or Azithromycin (prescribed by a healthcare provider), ORS.";
    }

    // Display the prediction result on the page
    const resultElement = document.getElementById('result');
    resultElement.textContent = `The predicted condition is: ${condition}`;

    // Display the first aid and medicine suggestions
    const firstAidElement = document.getElementById('firstAid');
    firstAidElement.innerHTML = `
        <h2>First Aid Suggestions</h2>
        <p>${firstAid}</p>
    `;

    const medicineElement = document.getElementById('medicine');
    medicineElement.innerHTML = `
        <h2>Instructions to follow</h2>
        <p>${medicine}</p>
    `;

    // Apply animations (e.g., fade-in for the result box)
    resultPage.classList.add('fade-in');
}
