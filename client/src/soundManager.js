import buzzer from './mp3/buzzer.mp3'; //when a player buzzes in in head 2 head
import wrong from './mp3/wrong.mp3';
import correct from './mp3/correct.mp3';
import reveal from './mp3/reveal.mp3'; //regular round reveal
import fmReveal from './mp3/fm-reveal.mp3'; //fast money reveal

const soundManager = {
    buzzer,
    wrong,
    correct,
    reveal,
    'fm-reveal' : fmReveal
};

export default soundManager;