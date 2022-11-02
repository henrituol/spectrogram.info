/*
Henri Pitkänen 2022
*/

// This web application creates a quiz: the aim is to connect an audio sample and corresponding spectrogram.
// Audio samples and spectrograms are fetched from https://xeno-canto.org/

// Initialize variables for xeno-canto's audio samples and spectrograms.
let xenocantoAudio;
let xenocantoCorrectSpectrogram;
let xenocantoFalseX;
let xenocantoFalseY;
let dataFromXenocanto;
let citations = []; 

// For debugging
/*
let debuggerUFD = 0;    // UFD for utilizeFetchedData
let debuggerRS = 0;     // RS for randomizeSpectrograms
let debuggerCQP = 0;    // CQP for createQuizPage
let clickCounter = 0;
*/

// https://xeno-canto.org/ offers a handy query for JSON
// The scope of recordings is confined to A quality recordings.
// One page has 500 recordings in an array.
// There are 489 pages of A quality data (in November 2022).
// First, take a random page and make a query for it. Then, save its data for this session.
const randomPageNumber = Math.floor(Math.random() * 400);
const queryToRecordings = "https://xeno-canto.org/api/2/recordings?query=q:A&page=" + randomPageNumber;

fetch(queryToRecordings) // xeno-canto query into a promise
.then(response => response.json())  // Turn it into object
.then(saveData)           // Take the data to good use. See function below.
.catch(console.error);

function saveData(data) {
    dataFromXenocanto = data; // Save data into the global variable for later use.
    utilizeFetchedData(dataFromXenocanto); // This is also called later, hence, this different function; no need to save data again.
    //console.log("Data saved.")
    //console.log(data);
}

function utilizeFetchedData(data) {

    // For debugging
    /*
    console.log(xenocantoCorrectSpectrogram);
    debuggerUFD = debuggerUFD + 1;
    console.log("We came to utilizeFetchedData for " + debuggerUFD + ". time.")
    */
    
    // There are 500 recordings in the first page of data, therefore, let's pick one randomly.
    let randomNumber = Math.floor(Math.random() * 500);
    // Xeno-canto's data is organized in a way that we can access specific sample with title "recordings".
    let randomRecording = (data.recordings[randomNumber]);
    xenocantoAudio = randomRecording.file; // This is the URL to an audio sample.
    xenocantoCorrectSpectrogram = randomRecording.sono.large; // This is the URL to the corresponding spectrogram.
    // Also, save citation and licese to an array.
    let recordist = randomRecording.rec;
    let id = randomRecording.id;
    let license = randomRecording.lic;
    let citation = recordist + ", XC" 
        + id + ". Accessible at www.xeno-canto.org/" 
        + id + ". License: " + license;
    citations[0] = citation;


    // Choose random false spectrogram...
    let secondRandomNumber = Math.floor(Math.random() * 500);
    // ... but make sure it is not the one already chosen.
    if (randomNumber == secondRandomNumber) {
        // And if it is the same, create new random numbers until it is not the same.
        // Should be quite unlikely that we ever got here, let alone stay here for long.
        while (randomNumber == secondRandomNumber) {
            secondRandomNumber = Math.floor(Math.random() * 500);
            //console.log("We ended up making a new random number!")
        }
    }
    let firstFalse = (data.recordings[secondRandomNumber]);
    xenocantoFalseX = firstFalse.sono.large;
    recordist = firstFalse.rec;
    id = firstFalse.id;
    license = firstFalse.lic;
    citation = recordist + ", XC" 
        + id + ". Accessible at www.xeno-canto.org/" 
        + id + ". License: " + license;
    citations[1] = citation;

    // And the same thing for second false spectrogram.
    let thirdRandomNumber = Math.floor(Math.random() * 500);
    if (randomNumber == thirdRandomNumber) {
        while (randomNumber == thirdRandomNumber) {
            thirdRandomNumber = Math.floor(Math.random() * 500);
            //console.log("We ended up making a new random number!")
        }
    }
    let secondFalse = (data.recordings[thirdRandomNumber]);
    xenocantoFalseY = secondFalse.sono.large;
    recordist = secondFalse.rec;
    id = secondFalse.id;
    license = secondFalse.lic;
    citation = recordist + ", XC" 
        + id + ". Accessible at www.xeno-canto.org/" 
        + id + ". License: " + license;
    citations[2] = citation;

    //console.log(citations);

    // To indicate the user that the app is ready to be used, change the text inside the button.
    document.getElementById("next").innerHTML = "Quiz me!"
    document.getElementById("next").addEventListener("click", randomizeSpectrograms);
}


//  Before we create a new quiz view, let's randomize order of the images.
function randomizeSpectrograms () {

    // For debugging
    //debuggerRS = debuggerRS + 1;
    //console.log("We came to createQuizPage for " + debuggerRS + ". time.")

    // Variables into array and shuffle.

    // This shuffle array is posted in multiple sites in the internet as an easy solution.
    // However, many also note "not all permutations have the same probability"
    // https://javascript.info/task/shuffle 
    // Then again, in this context, it is sufficient.
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }
      
    let arrayOfSpectrograms = [xenocantoFalseY, xenocantoFalseX, xenocantoCorrectSpectrogram];
    shuffle(arrayOfSpectrograms);

    let idOfCorrectAnswer;

    // Is correct answer going to be A, B, or C?
    if (arrayOfSpectrograms[0] == xenocantoCorrectSpectrogram) {
        idOfCorrectAnswer = "A";
    } else if (arrayOfSpectrograms[1] == xenocantoCorrectSpectrogram) {
        idOfCorrectAnswer = "B";
    } else if (arrayOfSpectrograms[2] == xenocantoCorrectSpectrogram) {
        idOfCorrectAnswer = "C";
    } else {
        console.log("Something went terribly wrong with shuffling the spectrograms.")
    }

    createQuizPage(
        xenocantoAudio,             // Audio file
        arrayOfSpectrograms[0],     // First image
        arrayOfSpectrograms[1],     // Second image
        arrayOfSpectrograms[2],     // Third image
        idOfCorrectAnswer           // Id of the right answer.
        );
};

// Main function that connects various parts to create a quiz page.
function createQuizPage(audioFile, image1, image2, image3, whichOneIsRight) {

    // For debugging
    //debuggerCQP = debuggerCQP + 1;
    //console.log("We came to createQuizPage for " + debuggerCQP + ". time.")

    // Until the hyperlinks for next batch is ready, show "loading" on the button.
    // However, this shouldn't take more than a couple of ms, hence, something is
    // broken, if this is shown.
    document.getElementById("next").innerHTML = "Loading...";

    // Change welcome text into instructions.
    document.getElementById("firstParagraph").innerHTML="Listen to the audio sample and select the corresponding spectrogram.";

    document.querySelector(".firstrow").style.background = "aliceblue";
    document.querySelector(".secondrow").style.background = "aliceblue";
    document.querySelector(".thirdrow").style.background = "aliceblue";

    // Also, at start of function, empty divs. 
    // Otherwise, content will stack up when the button is pushed.
    clearDivs();

    // Select song from the local folder and create the player.
    createPlayer(audioFile);

    createCitationsWindow();

    // Display spectrograms and checkboxes
    displaySpectrogram(image1, 1); // Display spectrogram specified when function is called on the row #1.
    displaySpectrogram(image2, 2);
    displaySpectrogram(image3, 3);
    document.getElementById("result").innerHTML= "Select a checkbox."

    // Create checkbox listeners 
    document.getElementById("A").addEventListener(
        "change", () => { 
            uncheckPreviousAnswer("B", "C"),
            selectionResult("A", whichOneIsRight) 
    });
    document.getElementById("B").addEventListener(
        "change", () => { 
            uncheckPreviousAnswer("A", "C"),
            selectionResult("B", whichOneIsRight) 
    });
    document.getElementById("C").addEventListener(
        "change", () => { 
            uncheckPreviousAnswer("A", "B"),
            selectionResult("C", whichOneIsRight) 
        });

    // Check whether the checkbox that changed is the correct selection or not.
    // Also, let the user know!
    function selectionResult(checkboxId, whichOneIsRight) {
        if (checkboxId == whichOneIsRight) {
            document.getElementById("result").innerHTML="Correct answer!";
            switch(checkboxId) {
                case "A":
                    document.querySelector(".firstrow").style.background = 'palegreen';
                    break;
                case "B":
                    document.querySelector(".secondrow").style.background = 'palegreen';
                    break;
                case "C":
                    document.querySelector(".thirdrow").style.background = 'palegreen';
                    break;
            }
        } else {
            let answer = "Wrong answer!"; 
            document.getElementById("result").innerHTML=answer;
            switch(checkboxId) {
                case "A":
                    document.querySelector(".firstrow").style.background = 'salmon';
                    break;
                case "B":
                    document.querySelector(".secondrow").style.background = 'salmon';
                    break;
                case "C":
                    document.querySelector(".thirdrow").style.background = 'salmon';
                    break;
            }
        }
    }

    // Check, if there is already a selection symbol in another checkbox.
    // If there is, clear that box. Otherwise, it will look like you could have multiple choices, which isn't true.
    function uncheckPreviousAnswer(anotherCheckbox, yetAnotherCheckbox) {
        if (document.getElementById(anotherCheckbox).checked == true) {
            document.getElementById(anotherCheckbox).checked = false;
            switch(anotherCheckbox) {
                case "A":
                    document.querySelector(".firstrow").style.background = 'aliceblue';
                    break;
                case "B":
                    document.querySelector(".secondrow").style.background = 'aliceblue';
                    break;
                case "C":
                    document.querySelector(".thirdrow").style.background = 'aliceblue';
                    break;
            }
        } 
        if (document.getElementById(yetAnotherCheckbox).checked == true) {
            document.getElementById(yetAnotherCheckbox).checked = false;
            switch(yetAnotherCheckbox) {
                case "A":
                    document.querySelector(".firstrow").style.background = 'aliceblue';
                    break;
                case "B":
                    document.querySelector(".secondrow").style.background = 'aliceblue';
                    break;
                case "C":
                    document.querySelector(".thirdrow").style.background = 'aliceblue';
                    break;
            }
        }
    }

    // Ready the next quiz view.
    utilizeFetchedData(dataFromXenocanto);
}




// ============================ HELPER FUNCTIONS ========================================= // 

// Create an audio player that has basic controls and plays the chosen file.
function createPlayer(songFile) {
    const song = document.createElement("audio");
    song.controls = "controls";
    song.src = songFile;
    song.type = "audio/mp3";
    document.querySelector(".player").appendChild(song);
    song.play();
}

function createCitationsWindow() {
    const citationButton = document.createElement("button");
    citationButton.innerText = "See citations"
    document.querySelector(".player").appendChild(citationButton);
    citationButton.addEventListener("click", showCitations);
    citationButton.style = "margin-left: 10px; vertical-align: 100%;";

    function showCitations () {
        alert("Sources of the audio file and spectrograms: \n \n"
            + citations[0] + "\n \n"
            + citations[1] + "\n \n"
            + citations[2]
        )
    }
}

// Display three spectrograms and create checkboxes next to the images.
function displaySpectrogram(spectrogramFile, numberOfRow) {
    
    // Create spectrogram related variable and information
    const image = document.createElement("img");
    image.src = spectrogramFile;
    // Image width depending on the size of the viewport, i.e., desktop or mobile.
    let maxWidth = document.documentElement.clientWidth;
    //console.log(maxWidth);
    if (maxWidth < 600) {
        image.width = maxWidth * 0.75;
    } else {
        image.width = 500;
    }

    // Create checkbox related variable and information
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Display the chosen spectrogram and checkbox on selected number of row.
    if (numberOfRow == 1) {
        document.querySelector(".firstrow").appendChild(image);
        checkbox.id = "A";
        document.querySelector(".firstrow").appendChild(checkbox);
    } else if (numberOfRow == 2) {
        document.querySelector(".secondrow").appendChild(image);
        checkbox.id = "B";
        document.querySelector(".secondrow").appendChild(checkbox);
    } else if (numberOfRow == 3) {
        document.querySelector(".thirdrow").appendChild(image);
        checkbox.id = "C";
        document.querySelector(".thirdrow").appendChild(checkbox);
    }
}

// A small helper function to enable easy clearing of divs.
function clearDivs () {
    document.querySelector(".player").innerHTML="";
    document.querySelector(".firstrow").innerHTML="";
    document.querySelector(".secondrow").innerHTML="";
    document.querySelector(".thirdrow").innerHTML="";
    document.getElementById("result").innerHTML="";
}
