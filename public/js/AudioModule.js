const AudioModule = (function () {
    const placeMarkAudio = new Audio("./public/assets/audio/placeMarkAudio.mp3");
    const roundCompleteAudio = new Audio("./public/assets/audio/roundCompleteAudio.mp3");

    const playMarkAudio = () => {
        placeMarkAudio.play();
    }

    const playRoundCompleteAudio = () => {
        roundCompleteAudio.play();
    }


    return { playMarkAudio, playRoundCompleteAudio }

})();