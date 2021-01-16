import buzzer from './mp3/buzzer.mp3'; //when a player buzzes in in head 2 head
import wrong from './mp3/wrong.mp3';
import correct from './mp3/correct.mp3';
import reveal from './mp3/reveal.mp3'; //regular round reveal
import fmReveal from './mp3/fm-reveal.mp3'; //fast money reveal
import fmRevealWrong from './mp3/reveal-wrong.mp3';
import fmRevealRight from './mp3/reveal-right.mp3';
import fmBG from './mp3/rr-bg.mp3'; //background music for fast money guessing
import theme from './mp3/theme.mp3';


const soundManager = {
    buzzer,
    wrong,
    correct,
    reveal,
    theme,
    'fm-reveal' : fmReveal,
    'fm-bg' : fmBG,
    'fm-reveal-wrong' : fmRevealWrong,
    'fm-reveal-right' : fmRevealRight
};

export default soundManager;