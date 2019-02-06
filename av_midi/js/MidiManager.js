import Midimapping from './utils/MidiMapping.js';

class MidiManager {

    constructor() {
        this.mapping = Midimapping;
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(this.onMidiSuccess.bind(this));
        }
    }

    disableController() {
        this.mapping = new Array();
    }

    onMidiSuccess(midi) {
        if (this.mapping != null) {
            let midiAccess = midi;
            var inputs = midi.inputs;
            for (var input of inputs.values()) {
                input.onmidimessage = this.onMidiMessage.bind(this);
            }
        }
    }

    onMidiMessage(event) {
        let cmd = event.data[0] >> 4;
        let channel = event.data[0] & 0xf;
        let btnID = event.data[1];
        let value = event.data[2];

        console.log(channel, btnID, cmd, value);

        for (let i = 0; i < this.mapping.length; i++) {
            if (channel == this.mapping[i].channel &&
                btnID == this.mapping[i].btnID &&
                cmd == this.mapping[i].cmd) {
                this.mapping[i].fn(value);
            }
        }
    }
}

export default MidiManager;
