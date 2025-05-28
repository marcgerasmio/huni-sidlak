class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  detectPitch(buffer, sampleRate) {
    const SIZE = buffer.length;
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;

    // Calculate RMS value
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.005) return -1;

    let lastCorrelation = 1;
    for (let offset = 0; offset < SIZE; offset++) {
      let correlation = 0;

      for (let i = 0; i < SIZE - offset; i++) {
        correlation += buffer[i] * buffer[i + offset];
      }

      correlation = correlation / (SIZE - offset);
      
      if (correlation > 0.8 && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }
      lastCorrelation = correlation;
    }

    if (foundGoodCorrelation) {
      const frequency = sampleRate / bestOffset;
      if (frequency >= 80 && frequency <= 350) {
        return frequency;
      }
    }
    return -1;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];
    
    // Fill our buffer
    for (let i = 0; i < inputChannel.length; i++) {
      this.buffer[this.bufferIndex] = inputChannel[i];
      this.bufferIndex++;
      
      if (this.bufferIndex >= this.bufferSize) {
        // Process the buffer
        const frequency = this.detectPitch(this.buffer, sampleRate);
        
        if (frequency > 0) {
          this.port.postMessage({
            type: 'frequency',
            frequency: frequency
          });
        }
        
        // Reset buffer
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor('pitch-processor', PitchProcessor); 