let textArea;
let midiAccess;

document.addEventListener('DOMContentLoaded', (event) => {
    textArea = document.getElementById('result');

    initMidi();
});

function initMidi() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(
            midiSuccess,
            midiFailure
        );
    } else {
        midiFailure();
    }
}

function midiSuccess(midi) {
    textArea.value = 'Midi is working!';

    midiAccess = midi;
    var inputs = midi.inputs;
    for (var input of inputs.values()) {
        input.onmidimessage = onMidiMessage;
    }
}

function midiFailure() {
    textArea.value = 'Failure: Midi is not working!';
}

function onMidiMessage(event) {
  let cmd = event.data[0] >> 4;
  let channel = event.data[0] & 0xf;
  let btnID = event.data[1];
  let value = event.data[2];

  textArea.value += "\n" +
    "New Event (on Channel: "+channel+")==> Type: "+ cmd +
    ", Origin: "+btnID +
    ", Value: "+value;

  textArea.scrollTop = textArea.scrollHeight;
}
