const schemaPath = 'client/src/schema/';
const dataPath = 'client/src/data/';
const fs = require('fs');
const questionSchema = JSON.parse(fs.readFileSync(`${schemaPath}question.json`));
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

const answerSchema = questionSchema.answers[0];

const minAnswers = 4;
const maxAnswers = 8;

const minPoints = 32;
const maxPoints = 86;

const questions = [];

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 12,
      min: 4
    }
  });

const sentenceToQuestion = (sentence) => sentence.replace(/\.$/,'?');

const makeQuestion = (id) => {
    const question = Object.assign({},questionSchema);
    
    question.question = sentenceToQuestion(lorem.generateSentences(1));
    question.ID = id;

    const numAnswers = between(minAnswers,maxAnswers);

    //console.log(numAnswers);

    question.answers = [];

    for(let i = 0; i < numAnswers; i++)
    {
        question.answers.push(makeAnswer());
    }
    return question;
}

const makeAnswer = () => {

    const answer = Object.assign({},answerSchema);
        answer.answer = lorem.generateWords(4);
        answer.points = between(minPoints,maxPoints);

    return answer;
}

const between = (min, max) => Math.floor(Math.random() * (max - min) + min);

const numQuestions = 300;

for(let i = 0; i < numQuestions; i++)
{
    questions.push(makeQuestion(i));
}

fs.writeFileSync(
    `${dataPath}sample-questions.json`,
    JSON.stringify(questions)
);