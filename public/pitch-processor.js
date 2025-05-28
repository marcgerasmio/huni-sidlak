class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 2048;
  }

  process(inputs) {
    const input = inputs[0][0];
    if (input) {
      // Add new samples to buffer
      this._buffer.push(...input);

      // While we have enough samples, send 2048 at a time
      while (this._buffer.length >= this._bufferSize) {
        const chunk = this._buffer.slice(0, this._bufferSize);
        this.port.postMessage(chunk);
        this._buffer = this._buffer.slice(this._bufferSize);
      }
    }
    return true;
  }
}

registerProcessor('pitch-processor', PitchProcessor);