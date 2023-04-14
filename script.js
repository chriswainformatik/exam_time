var examStarted = false;
var examEnded = false;
var additionalTimeEnded = false;
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
    if (showRemaining && !examEnded) {
        var hoursRemaining = 0;
        var minutesRemaining = 0;
        var secondsRemaining = 0;
        if (endTimeGlobal > date) {
            minutesRemaining = (endTimeGlobal.getMinutes() - date.getMinutes());
            hoursRemaining = (endTimeGlobal.getHours() - date.getHours());
            secondsRemaining = (endTimeGlobal.getSeconds() - date.getSeconds());
            if (secondsRemaining < 0) {
                secondsRemaining += 60;
                minutesRemaining -= 1;
            }
            if (minutesRemaining < 0) {
                minutesRemaining += 60;
                hoursRemaining -= 1;
            }
        } else {
            examEnded = true;
        }
        document.getElementById('clock-hours').innerHTML = hoursRemaining.toString().padStart(2, '0');
        document.getElementById('clock-minutes').innerHTML = minutesRemaining.toString().padStart(2, '0');
        document.getElementById('clock-seconds').innerHTML = secondsRemaining.toString().padStart(2, '0');
    } else if (examEnded && !additionalTimeEnded) {
        // TODO
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
        Array.from(document.getElementsByClassName('additional-time-display')).forEach(element => {
            var additionalMinutesExact = minutes*parseFloat(element.dataset.value);
            var additionalMinutes = Math.floor(additionalMinutesExact);
            var additionalSeconds = Math.round((additionalMinutesExact-additionalMinutes)*60);
            element.children[1].innerHTML = additionalMinutes.toString().padStart(2, '0') + ':' + additionalSeconds.toString().padStart(2, '0');

        });
        document.getElementById('error-msg-time-not-set-2').classList.add('d-none');
        document.getElementById('btn-add-additional-time').disabled = false;
    } else {
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


document.getElementById('btn-add-additional-time').addEventListener('click', addAdditionalTime);

function addAdditionalTime() {
    var inputDiv = document.createElement('div');
    inputDiv.classList.add('row');
    inputDiv.classList.add('additional-time-input');
    var id = document.getElementsByClassName('additional-time-input').length;
    inputDiv.id = 'additional-time-input-' + id;
    inputDiv.dataset.id = id;
    var inputPercentage = document.createElement('select');
    inputPercentage.classList.add('col');
    inputPercentage.classList.add('form-select');
    inputPercentage.id = 'additional-time-input-percentage' + id;
    for (var i = 0; i <= 100; i += 5) {
        var option = document.createElement('option');
        option.value = i;
        option.innerHTML = i + ' %';
        inputPercentage.add(option);
    }
    inputDiv.append(inputPercentage);
    var btnAdd = document.createElement('button');
    btnAdd.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>';
    btnAdd.classList.add('btn');
    btnAdd.classList.add('btn-success');
    btnAdd.classList.add('col-auto');
    btnAdd.id = 'additional-time-add-btn-' + id;
    btnAdd.addEventListener('click', () => {
        toggleAdditionalTime(id, 'add');
    });
    inputDiv.append(btnAdd);
    var btnRemove = document.createElement('button');
    btnRemove.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>';
    btnRemove.classList.add('btn');
    btnRemove.classList.add('btn-outline-danger');
    btnRemove.classList.add('col-auto');
    btnRemove.disabled = true;
    btnRemove.id = 'additional-time-remove-btn-' + id;
    btnRemove.addEventListener('click', () => {
        toggleAdditionalTime(id, 'remove');
    });
    inputDiv.append(btnRemove);
    document.getElementById('additional-time-input-wrapper').append(inputDiv);
    document.getElementById('additional-time-input-wrapper').classList.remove('d-none');
}

/**
 * Add or remove additional time displays in the upper left corner of the screen.
 * 
 * @param {Number} id 
 * @param {String} action 
 */
function toggleAdditionalTime(id, action) {
    var btnAdd = document.getElementById('additional-time-add-btn-' + id);
    var btnRemove = document.getElementById('additional-time-remove-btn-' + id);
    var inputPercentage = document.getElementById('additional-time-input-percentage' + id);
    if (action == 'add') {
        // toggle able/disable buttons
        btnAdd.disabled = true;
        btnRemove.classList.remove('btn-outline-danger');
        btnRemove.classList.add('btn-danger');
        btnRemove.disabled = false;
        inputPercentage.disabled = true;
        // add additional time display
        var wrapperDiv = document.getElementById('additional-time-wrapper');
        var additionalTimeDiv = document.createElement('div');
        additionalTimeDiv.id = 'additional-time-display-' + id;
        additionalTimeDiv.dataset.id = id;
        additionalTimeDiv.classList.add('row');
        additionalTimeDiv.classList.add('additional-time-display');
        // create time label div
        var additionalTimeLabel = document.createElement('div');
        additionalTimeLabel.classList.add('col-auto');
        additionalTimeLabel.classList.add('text-end');
        additionalTimeLabel.classList.add('fs-3');
        var percentage = parseInt(document.getElementById('additional-time-input-percentage' + id).value)/100;
        additionalTimeLabel.innerHTML = (percentage*100) + ' %';
        additionalTimeDiv.dataset.value = percentage;
        additionalTimeDiv.append(additionalTimeLabel);
        // create time value div
        var additionalTimeValue = document.createElement('div');
        additionalTimeValue.classList.add('col');
        additionalTimeValue.classList.add('text-end');
        additionalTimeValue.classList.add('fs-3');
        additionalTimeValue.id = 'additional-time-value-' + id;
        // additional time value
        var totalMinutes = parseInt(document.getElementById('input-total-time').value);
        var additionalMinutesExact = totalMinutes*percentage;
        var additionalMinutes = Math.floor(additionalMinutesExact);
        var additionalSeconds = Math.round((additionalMinutesExact-additionalMinutes)*60);
        additionalTimeValue.innerHTML = additionalMinutes.toString().padStart(2, '0') + ':' + additionalSeconds.toString().padStart(2, '0');
        // add to time display div
        additionalTimeDiv.append(additionalTimeValue);
        if (wrapperDiv.childElementCount == 0) {
            wrapperDiv.append(additionalTimeDiv);
        } else {
            var insertComplete = false;
            Array.from(wrapperDiv.children).forEach(element => {
                if (parseInt(element.dataset.id) > parseInt(id)) {
                    wrapperDiv.insertBefore(additionalTimeDiv, element);
                    insertComplete = true;
                }
            });
            if (!insertComplete) {
                wrapperDiv.append(additionalTimeDiv);
            }
        }
    } else {
        // action == 'remove'
        btnAdd.disabled = false;
        btnRemove.classList.add('btn-outline-danger');
        btnRemove.classList.remove('btn-danger');
        btnRemove.disabled = true;
        inputPercentage.disabled = false;
        // remove additional time display
        document.getElementById('additional-time-display-' + id).remove();
    }
}