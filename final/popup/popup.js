var refreshDisplayTimeout;
var bgpage = chrome.extension.getBackgroundPage();
var previousValues = [3, 5, 10, 30];
var editing = false;
var timerOn = false; // this will be toggled on/off when the play-pause button is pressed

var pauseplay = document.querySelector('#pauseplay');
if (pauseplay)
    pauseplay.addEventListener("click", function() {
        if (timerOn)
            pauseTimer();
        else if (bgpage.getPauseDate())
            resumeTimer();
        else
            setTimer();
    });
var powerButton = document.querySelector('#power-button'); //stopbutton -> will cause the timer to stop
if (powerButton)
    powerButton.addEventListener("click", function() {
        if (timerOn)
            reset();
    });

// !- Always returns 25 minutes. Needs to be compatible with input (use document.something)
function getChoice() {

    var num;
    num = 25; // remove this

    // add some form of input. Maybe the user can change the value in Options.Js??

    return num;
}

function setTimer()
{

    // SET background timer for selected number
    // HIDE settings, DISPLAY countdown

    var num = getChoice();

    // set timer, hide settings, display reset button
    if(isValid(num))
    {
        bgpage.setAlarm(num * 60000); // converts to miliseconds
        timerOn = true;
        document.getElementById('timer-text').innerHTML = bgpage.getTimeLeftString();
        refreshDisplay();
    }
    else
        bgpage.error();
}

function refreshDisplay()
{
    if(bgpage.alarmDate) 
    {
        document.getElementById('timer-text').innerHTML = bgpage.getTimeLeftString();
        refreshDisplayTimeout = setTimeout(refreshDisplay, 100);
    }
    else
    {
        reset();
    }
}

// Returns true if 0 <= amt <= 240
function isValid(amt)
{
    if(isNaN(amt) || (amt == null))
        return false;
    else if((amt < 0) || (amt > 240))
        return false;
    else
        return true;
}

function pauseTimer() {
    clearTimeout(refreshDisplayTimeout);
    timerOn = false;
    bgpage.pause();
}

function resumeTimer()
{
    bgpage.resume();
    refreshDisplay();
    timerOn = true;
}

function restartTimer()
{
    bgpage.restart();
    refreshDisplay();
    timerOn = true;
}

function reset()
{
    clearTimeout(refreshDisplayTimeout);
    bgpage.turnOff();
    timerOn = false;
}
