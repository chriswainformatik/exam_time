var examStarted = false;
var endTimeGlobal = undefined;
var showRemaining = false; // show clock if set to false

document.addEventListener('DOMContentLoaded', () => {
    loadBackgroundImage();
    updateTime();
    setInterval(updateTime, 500);
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('d-none');
        document.getElementById('btn-start-exam-fullscreen').classList.remove('d-none');
    }, 500);
});

function loadBackgroundImage() {
    var randomNumber = Math.floor(Math.random() * 8);
    document.getElementById('wrapper').style.backgroundImage = 'url("img/' + randomNumber +'.jpg")';
}

function positionSeconds() {
    var wHours = document.getElementById('clock-hours').offsetWidth;
    var wMinS = document.getElementById('clock-minutes-and-seconds').offsetWidth;
    var correction = (wMinS - wHours) / 2;
    document.getElementById('clock-inner').style.transform = 'translateX(' + (correction) + 'px)';
}

function updateTime() {
    var date = new Date();
    if (showRemaining) {
        var minutesRemaining = (endTimeGlobal.getMinutes() - date.getMinutes());
        var hoursRemaining = (endTimeGlobal.getHours() - date.getHours());
        var secondsRemaining = (endTimeGlobal.getSeconds() - date.getSeconds());
        if (secondsRemaining < 0) {
            secondsRemaining += 60;
            minutesRemaining -= 1;
        }
        if (minutesRemaining < 0) {
            minutesRemaining += 60;
            hoursRemaining -= 1;
        }
        document.getElementById('clock-hours').innerHTML = hoursRemaining.toString().padStart(2, '0');
        document.getElementById('clock-minutes').innerHTML = minutesRemaining.toString().padStart(2, '0');
        document.getElementById('clock-seconds').innerHTML = secondsRemaining.toString().padStart(2, '0');
    } else {
        document.getElementById('clock-hours').innerHTML = date.getHours().toString().padStart(2, '0');
        document.getElementById('clock-minutes').innerHTML = date.getMinutes().toString().padStart(2, '0');
        document.getElementById('clock-seconds').innerHTML = date.getSeconds().toString().padStart(2, '0');
    }
    positionSeconds();
}


document.getElementById('btn-save-settings').addEventListener('click', saveTotalTime);

function saveTotalTime() {
    document.getElementById('input-total-time').classList.remove('is-invalid');
    document.getElementById('error-msg-time-not-set').classList.remove('d-block');
    var totalTime = document.getElementById('input-total-time').value;
    if (totalTime.length > 0) {
        var minutes = parseInt(totalTime);
        endTimeGlobal = new Date();
        endTimeGlobal.setMinutes(endTimeGlobal.getMinutes()+minutes);
        document.getElementById('total-time-value').innerHTML = minutes + ' min';
    }
    /*else if (endTime.length > 0) {
        endTimeGlobal = new Date();
        endTimeGlobal.setHours(parseInt(endTime.split(':')[0]));
        endTimeGlobal.setMinutes(parseInt(endTime.split(':')[1]));
        endTimeGlobal.setSeconds(0);
        endTimeGlobal.setMilliseconds(0);
    }*/
    else {
        showErrorTimeNotSet();
    }
    document.getElementById('select-remaining').disabled = false;
}

document.getElementById('select-time-or-remaining').addEventListener('change', event => {
    if (event.target.value == 'remaining') {
        showRemaining = true;
        document.getElementById('remaining-time-caption').classList.remove('d-none');
        //document.getElementById('clock-seconds').classList.add('d-none');
    } else {
        showRemaining = false;
        document.getElementById('remaining-time-caption').classList.add('d-none');
        //document.getElementById('clock-seconds').classList.remove('d-none');
    }
});

/*
document.getElementById('input-total-time').addEventListener('keyup', event => {
    console.log(event.target.value.length)
    var selectTimeOrRemaining = document.getElementById('select-remaining');
    if (event.target.value.length > 0) {
        selectTimeOrRemaining.disabled = false;
    } else {
        selectTimeOrRemaining.disabled = true;
    }
});
*/

document.getElementById('btn-start-exam-fullscreen').addEventListener('click', startExam);
document.getElementById('btn-start-exam-sidebar').addEventListener('click', startExam);

function startExam() {
    saveTotalTime();
    var now = new Date();
    // round up to the next full minute
    now.setMinutes(now.getMinutes()+1);
    now.setSeconds(0);
    now.setMilliseconds(0);
    var totalTime = document.getElementById('input-total-time').value;
    if (totalTime.length == 0) {
        document.getElementById('btn-toggle-sidebar').click();
        showErrorTimeNotSet();
    } else {
        // close sidebar
        document.getElementById('btn-sidebar-close').click();
        
        // display end time
        document.getElementById('end-time-value').innerHTML = endTimeGlobal.getHours().toString().padStart(2, '0') + ':' + endTimeGlobal.getMinutes().toString().padStart(2, '0');
        
        // disable changing of total time
        document.getElementById('input-total-time').disabled = true;

        // show "started" on button
        Array.from(document.getElementsByClassName('btn-start-exam')).forEach(element => {
            element.innerHTML = 'Gestartet!';
            element.disabled = true;
        });

        // display "reload" info text in sidebar
        document.getElementById('info-restart').classList.remove('d-none');
        
        examStarted = true;
    }
}

function showErrorTimeNotSet() {
    document.getElementById('input-total-time').classList.add('is-invalid');
    document.getElementById('error-msg-time-not-set').classList.add('d-block');
}