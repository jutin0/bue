let mediaRecorder;
let recordedChunks = [];
let recordedBlobs = {};
let reminderBlobs = {};
let audio = new Audio();
let reminderAudio = new Audio();
let reminderIntervals = {};

function setAlarm() {
    const alarmTime = document.getElementById('alarmTime').value;

    if (alarmTime === '') {
        alert('Por favor, ingrese una hora.');
        return;
    }

    const alarmList = document.getElementById('alarmList');
    const listItem = document.createElement('li');
    listItem.innerText = `Alarma a las ${alarmTime}`;
    alarmList.appendChild(listItem);

    const alarmTimeParts = alarmTime.split(':');
    const alarmDate = new Date();
    alarmDate.setHours(alarmTimeParts[0]);
    alarmDate.setMinutes(alarmTimeParts[1]);
    alarmDate.setSeconds(0);

    const now = new Date();
    const timeToAlarm = alarmDate.getTime() - now.getTime();

    if (timeToAlarm >= 0) {
        setTimeout(() => {
            playAlarmMessage(alarmTime);
        }, timeToAlarm);
    } else {
        alert('La hora de la alarma ya ha pasado. Por favor, ingrese una hora futura.');
    }
}

function playAlarmMessage(alarmTime) {
    const audioUrl = recordedBlobs[alarmTime];
    if (audioUrl) {
        audio.src = audioUrl;
        audio.loop = true;
        audio.play();
        document.getElementById('stopPlaybackButton').style.display = 'block';
    } else {
        alert('No hay mensaje grabado para esta alarma.');
    }
}

function stopPlayback() {
    audio.pause();
    document.getElementById('stopPlaybackButton').style.display = 'none';
}

function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('La grabación de audio no es compatible con su navegador.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const alarmTime = document.getElementById('alarmTime').value;
                recordedBlobs[alarmTime] = url;
            };

            mediaRecorder.start();
            alert('Grabación iniciada. Hable ahora.');
        })
        .catch(error => {
            console.error('Error al acceder al micrófono:', error);
            alert('No se pudo acceder al micrófono.');
        });
}

function stopRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        alert('Grabación detenida.');
    }
}

function setReminder() {
    const reminderMessage = document.getElementById('reminderMessage').value;

    if (reminderMessage === '') {
        alert('Por favor, ingrese un mensaje de recordatorio.');
        return;
    }

    const reminderList = document.getElementById('reminderList');
    const listItem = document.createElement('li');
    listItem.innerText = `Recordatorio: ${reminderMessage}`;
    reminderList.appendChild(listItem);

    const now = new Date();
    const reminderTime = now.getTime();
    playReminderMessage(reminderMessage, reminderTime);

    reminderIntervals[reminderMessage] = setInterval(() => {
        playReminderMessage(reminderMessage, reminderTime);
    }, 3 * 60 * 60 * 1000); // 3 horas

    document.getElementById('stopRemindersButton').style.display = 'block';
}

function playReminderMessage(reminderMessage, reminderTime) {
    const audioUrl = reminderBlobs[reminderMessage];
    if (audioUrl) {
        reminderAudio.src = audioUrl;
        reminderAudio.play();
    } else {
        alert('No hay mensaje grabado para este recordatorio.');
    }
}

function stopReminders() {
    for (let message in reminderIntervals) {
        clearInterval(reminderIntervals[message]);
    }
    reminderIntervals = {};
    document.getElementById('stopRemindersButton').style.display = 'none';
}

function startReminderRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('La grabación de audio no es compatible con su navegador.');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            recordedChunks = [];

            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const reminderMessage = document.getElementById('reminderMessage').value;
                reminderBlobs[reminderMessage] = url;
            };

            mediaRecorder.start();
            alert('Grabación de recordatorio iniciada. Hable ahora.');
        })
        .catch(error => {
            console.error('Error al acceder al micrófono:', error);
            alert('No se pudo acceder al micrófono.');
        });
}

function stopReminderRecording() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        alert('Grabación de recordatorio detenida.');
    }
}
