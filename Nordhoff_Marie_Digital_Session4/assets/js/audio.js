class animationObject {
    constructor(animationElement, sensitivity, transition, lowerOutput, upperOutput, highPass, lowPass, axisTag) {
        this.animationElement = animationElement;
        this.sensitivity = sensitivity;
        this.transition = transition;
        this.lowerOutput = lowerOutput;
        this.upperOutput = upperOutput;
        this.highPass = highPass; 
        this.lowPass= lowPass;
        this.axisTag = axisTag;
    }
}

function animateAll(audioElementId, animationObjects){

    const MAX_IN_MAX = 255; // Maximum value for inMax

    const audioElement = document.getElementById(audioElementId);
    console.log(audioElement);
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audioElement);
    const analyzer = audioContext.createAnalyser();

    var gainNode = audioContext.createGain();
    var lowpass = audioContext.createBiquadFilter();
    var highpass = audioContext.createBiquadFilter();

    var lowerOutput = lowerOutput;
    var upperOutput = upperOutput;


    track.connect(analyzer);
    analyzer.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gainNode);
    analyzer.connect(audioContext.destination);

    lowpass.type = "lowpass";
    lowpass.frequency.value = audioContext.sampleRate / 2;
    lowpass.gain.value = -1;
    highpass.type = "highpass";
    highpass.frequency.value = 0;
    highpass.gain.value = -1;

    audioElement.play();

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    let animationId;

    function mapValue(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    function animate() {
		analyzer.getByteFrequencyData(dataArray);
        animationObjects.forEach((element) => {
            var SENSITIVITY = element.sensitivity;

            lowpass.frequency.value = element.lowPass;
            highpass.frequency.value = element.highPass;

            var dynamicInMax = Math.max(MAX_IN_MAX * (1 - SENSITIVITY), 1);

            var lowerBound = (Math.floor(analyzer.frequencyBinCount/audioContext.sampleRate*element.lowPass), 0);
            var upperBound = (Math.floor(analyzer.frequencyBinCount/audioContext.sampleRate*element.highPass), analyzer.fftSize);

            var sum = dataArray.slice(lowerBound, upperBound).reduce((a, b) => a + b, 0);

            var average = sum / (upperBound-lowerBound);

            var animationValue = Math.floor(mapValue(average, 0, dynamicInMax, element.lowerOutput, element.upperOutput));

            document.querySelector(element.animationElement).style.setProperty(element.axisTag, animationValue);

            document.querySelector(element.animationElement).style.setProperty('--transition-duration', element.transition+'s');
        });
        
        animationId = requestAnimationFrame(animate);
    }

    audioElement.onplay = () => {
        audioContext.resume();
        animationId = requestAnimationFrame(animate);
    };

    audioElement.onpause = () => {
        cancelAnimationFrame(animationId);
    };

    audioElement.onended = () => {
        cancelAnimationFrame(animationId);
    };
}