let synthesis: SpeechSynthesis | null = null;
let utterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;
let loopInterval: number | undefined;

export const startPreventionTTS = (
  message: string = "도박은 자신에 대한 예의가 아닙니다.",
  intervalMs: number = 4500
) => {
  if (isSpeaking) return;
  
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synthesis = window.speechSynthesis;
    
    utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'ko-KR'; // Korean
    utterance.rate = 0.9; // Slightly slower for emphasis
    utterance.pitch = 0.8; // Slightly deeper, serious tone
    
    // Play immediately
    synthesis.speak(utterance);
    isSpeaking = true;

    // Loop it
    loopInterval = window.setInterval(() => {
        if (synthesis && utterance) {
            // Cancel any pending speech just to be safe before speaking again
            synthesis.cancel();
            synthesis.speak(utterance);
        }
    }, intervalMs); // Repeat interval
  }
};

export const stopPreventionTTS = () => {
  if (loopInterval) {
    window.clearInterval(loopInterval);
  }
  if (synthesis) {
    synthesis.cancel();
  }
  isSpeaking = false;
};
