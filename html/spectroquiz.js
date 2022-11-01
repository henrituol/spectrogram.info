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

// https://xeno-canto.org/ offers a handy query for JSON
// The scope of recordings is confined to A quality recordings.
fetch("https://xeno-canto.org/api/2/recordings?query=q:A") // xeno-canto query into a promise
.then(response => response.json())  // Turn it into object
.then(saveData)           // Take the data to good use. See function below.
.catch(console.error);

function saveData(data) {
    dataFromXenocanto = data; // Save data into the global variable for later use.
    utilizeFetchedData(dataFromXenocanto); // This is also called later, hence, this different function; no need to save data again.
}

function utilizeFetchedData(data) {
    
    // There are 500 recordings in the first page of data, therefore, let's pick one randomly between 1-500.
    let randomNumber = Math.floor(Math.random() * 501);
    // Xeno-canto's data is organized in a way that we can access specific sample with title "recordings".
    let randomRecording = (data.recordings[randomNumber]);
    xenocantoAudio = randomRecording.file; // This is the URL to an audio sample.
    xenocantoCorrectSpectrogram = randomRecording.sono.large; // This is the URL to the corresponding spectrogram.

    // Choose random false spectrogram...
    let secondRandomNumber = Math.floor(Math.random() * 501);
    // ... but make sure it is not the one already chosen.
    if (randomNumber == secondRandomNumber) {
        // And if it is the same, create new random numbers until it is not the same.
        // Should be quite unlikely that we ever got here, let alone stay here for long.
        while (randomNumber == secondRandomNumber) {
            secondRandomNumber = Math.floor(Math.random() * 501);
            //console.log("We ended up making a new random number!")
        }
    }
    let firstFalse = (data.recordings[secondRandomNumber]);
    xenocantoFalseX = firstFalse.sono.large;

    // And the same thing for second false spectrogram.
    let thirdRandomNumber = Math.floor(Math.random() * 501);
    if (randomNumber == thirdRandomNumber) {
        while (randomNumber == thirdRandomNumber) {
            thirdRandomNumber = Math.floor(Math.random() * 501);
            //console.log("We ended up making a new random number!")
        }
    }
    let secondFalse = (data.recordings[thirdRandomNumber]);
    xenocantoFalseY = secondFalse.sono.large;

    // To indicate the user that the app is ready to be used, change the text inside the button.
    document.getElementById("next").innerHTML = "Quiz me!"
    document.getElementById("next").addEventListener(
        "click", () => { randomizeSpectrograms(); }
    );
}


// ============================ MAIN FUNCTIONS ========================================= // 

//  Before we create a new quiz view, let's randomize order of the images.
function randomizeSpectrograms () {

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

    // Until the hyperlinks for next batch is ready, show "loading" on the button.
    // However, this shouldn't take more than a couple of ms, hence, something is
    // broken, if this is shown.
    document.getElementById("next").innerHTML = "Loading...";

    // Start readying the next quiz view.
    utilizeFetchedData(dataFromXenocanto);

    // Change welcome text into instructions.
    document.getElementById("firstParagraph").innerHTML="Listen to the audio sample and select the corresponding spectrogram.";

    document.querySelector(".firstrow").style.background = "aliceblue";
    document.querySelector(".secondrow").style.background = "aliceblue";
    document.querySelector(".thirdrow").style.background = "aliceblue";

    // Also, at start of function, empty divs. 
    // Otherwise, content will stack up when button is pushed.
    clearDivs();

    // Select song from the local folder and create the player.
    createPlayer(audioFile);

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
}




// ============================ HELPER FUNCTIONS ========================================= // 

// Create an audio player that has basic controls and plays the chosen file.
function createPlayer(songFile) {
    const song = document.createElement("audio");
    song.controls = "controls";
    song.src = songFile;
    song.type = "audio/mp3";
    document.querySelector(".player").appendChild(song);
    // song.play(); // If this is enabled, the console says: "Uncaught (in promise) DOMException: The fetching process for the media resource was aborted by the user agent at the user's request."
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
