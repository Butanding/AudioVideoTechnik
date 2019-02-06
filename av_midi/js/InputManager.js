import MidiManager from './MidiManager.js';

class InputManager {

    constructor() {
        this.currentMidiController;
    }

    addMidiController() {
        this.currentMidiController = new MidiManager();
    }

    disableMidiController() {
        this.currentMidiController.disableController();
    }

}

export default new InputManager;
