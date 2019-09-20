class OnsetDetector {
  diff_th;
  amp_input = null;
  buffer_size = 1024;
  index = 0;
  last_amp = null;
  amp_input = null;

  constructor(diff_th, buffer_size) {
    this.diff_th = diff_th;
    if (buffer_size !== undefined) {
      this.buffer_size = buffer_size;
    }
  }

  setInput(amp_input) { 
    this.amp_input = amp_input; 
  }

  /**
   * Returns whether an onset was detected.
   *
   * @returns { boolean } Whether an onset was detected in the current loop.
   */
  isOnset() {
    if (this.amp_input != null) {
      var new_amp = this.amp_input.getLevel();
      this.diff = new_amp - this.last_amp;
      this.last_amp = new_amp;

      return this.diff > this.diff_th;
    }
    return false;
  }
}
