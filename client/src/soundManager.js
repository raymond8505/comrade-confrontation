import buzzer from './mp3/buzzer.mp3'; //when a player buzzes in in head 2 head
import wrong from './mp3/wrong.mp3';
import correct from './mp3/correct.mp3';
import reveal from './mp3/reveal.mp3'; //regular round reveal
import fmReveal from './mp3/fm-reveal.mp3'; //fast money reveal
import theme from './mp3/theme.mp3';

const soundManager = {
    buzzer,
    wrong,
    correct,
    reveal,
    theme,
    'fm-reveal' : fmReveal
};

export default soundManager;