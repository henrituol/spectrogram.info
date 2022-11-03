const startButton = document.querySelector("#tutorialbtn");
startButton.addEventListener("click", openTutorial);

function openTutorial () {
    console.log("Open tutorial.");

    // Draw first view.
    const tutorialView = document.getElementById("maincontainer");
    tutorialView.innerHTML = `
    <div class="tutorialContainer" id="tutorialContainer">
        <h1>Tutorial</h1>
        <div id="info">
            <h3>How to read spectrograms related to an audio signal?</h3>
            <p></p>
            <p>The objective in spectrogram quiz is to connect an audio sample with a corresponding spectrogram. A spectrogram is a visualization of frequencies present in a signal. For example, this following image is a fairly typical spectrogram of a birdsong. Frequency from 0 Hz to 15 kHz is displayed on the y-axis. The x-axis represents time from 0 seconds on the left edge to 10 seconds on the right edge. In short, this spectrogram shows a few-second-long melody line of a <i>phylloscopus trochilus</i>. The brown graph under the spectrogram is the envelope representing the dynamics, i.e., how loud the signal is.</p>        
            <p></p>
            <img class="spectrogramDemoImage" id="spectrogramDemoImage" src="/demomaterial/XC726708-large.png" alt="Spectrogram demo">
            <p>Source: Lars Edenius, XC726708. Accessible at <a href="https://www.xeno-canto.org/726708" title="https://www.xeno-canto.org/726708">www.xeno-canto.org/726708</a>. <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" title="Go to Attribution-NonCommercial-ShareAlike 4.0 International">CC BY-NC-SA 4.0.</a></p>
            <p> </p>
            <p>Here's a video that shows where exactly we are on the spectrogram while we listen to the audio sample.</p>
            <p></p>
            <video class="demovideo" id="demovideo" controls>
                <source src="/demomaterial/Spectrogram_demo.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video> 
            <p>Press “back” to test your spectrogram reading skills.</p>
        </div>
        <div>
            <button class="button" id="backToHome">Back</button>
        </div>
    </div>
    `;

    // Container width depending on the size of the viewport, i.e., desktop or mobile.
    // Doesn't seem to work.
    
    let maxWidthForTutorial = document.documentElement.clientWidth;
    console.log(maxWidthForTutorial);
    if (maxWidthForTutorial < 600) {
        tutorialContainer.style = "max-width:" + maxWidthForTutorial + "px;";
        spectrogramDemoImage.style = "max-width:" + maxWidthForTutorial * 0.75 + "px;";
        demovideo.style = "max-width:" + maxWidthForTutorial * 0.75 + "px;";
    } else {
        tutorialContainer.style = "max-width: 585px;";
        spectrogramDemoImage.style = "max-width: 585px;";
        demovideo.style = "max-width: 585px;";
    }


    // A button to return back to the home page.
    let backButton = document.querySelector("#backToHome");
    backButton.addEventListener("click", () => {
        // Routing would be more elegant...
        // But for now, quick and dirty solution: refresh page
        location.reload(true);
    });

};

