var endTimeGlobal = undefined;

document.addEventListener('DOMContentLoaded', () => {
    loadBackgroundImage();
    setInterval(updateTime, 500);
});

function loadBackgroundImage() {
    var randomNumber = Math.floor(Math.random() * 8);
    document.getElementById('wrapper').style.backgroundImage = 'url("img/' + randomNumber +'.jpg")';
}

function updateTime() {
    var date = new Date();
    document.getElementById('clock-hours').innerHTML = date.getHours().toString().padStart(2, '0');
    document.getElementById('clock-minutes').innerHTML = date.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock-seconds').innerHTML = date.getSeconds().toString().padStart(2, '0');
}


document.getElementById('btn-save-settings').addEventListener('click', saveSettings);

function saveSettings() {
    document.getElementById('input-end-time').classList.remove('is-invalid');
    document.getElementById('input-total-time').classList.remove('is-invalid');
    document.getElementById('error-msg-time-not-set').classList.remove('d-block');
    var totalTime = document.getElementById('input-total-time').value;
    var endTime = document.getElementById('input-end-time').value;
    if (totalTime.length > 0) {
        endTimeGlobal = new Date();
        endTimeGlobal.setMinutes(endTimeGlobal.getMinutes()+parseInt(totalTime));
    } else if (endTime.length > 0) {
        endTimeGlobal = new Date();
        endTimeGlobal.setHours(parseInt(endTime.split(':')[0]));
        endTimeGlobal.setMinutes(parseInt(endTime.split(':')[1]));
        endTimeGlobal.setSeconds(0);
        endTimeGlobal.setMilliseconds(0);
    } else {
        showErrorTimeNotSet();
    }
    console.log(endTimeGlobal);
}


document.getElementById('btn-start-exam-fullscreen').addEventListener('click', startExam);
document.getElementById('btn-start-exam-sidebar').addEventListener('click', startExam);

function startExam() {
    var now = new Date();
    // round up to the next full minute
    now.setMinutes(now.getMinutes()+1);
    now.setSeconds(0);
    now.setMilliseconds(0);
    var totalTime = document.getElementById('input-total-time').value;
    var endTime = document.getElementById('input-end-time').value;
    if (totalTime.length == 0 && endTime.length == 0) {
        document.getElementById('btn-toggle-sidebar').click();
        showErrorTimeNotSet();
    }
}

function showErrorTimeNotSet() {
    document.getElementById('input-end-time').classList.add('is-invalid');
    document.getElementById('input-total-time').classList.add('is-invalid');
    document.getElementById('error-msg-time-not-set').classList.add('d-block');
}