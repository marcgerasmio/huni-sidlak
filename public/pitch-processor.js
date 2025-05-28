// pitch-processor.js
class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(2048);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this.buffer[this.bufferIndex++] = channelData[i];
        if (this.bufferIndex === this.buffer.length) {
          this.port.postMessage(this.buffer);
          this.bufferIndex = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('pitch-processor', PitchProcessor);
