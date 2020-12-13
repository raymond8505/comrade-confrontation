const {parse} = require('node-html-parser');
const axios = require('axios');
const {generateID,IDExists} = require('./helpers');
const questionSchema = require('./client/src/schema/question.json');
const cloneDeep = require('lodash/cloneDeep');
const fs = require('fs');

const dataDir = './client/src/data';
let fffQuestions = [];

const minAnswers = 3;

const parseFamilyFeudFriends = (html,url) => {
    
    const root = parse(html);
    const links = root.querySelectorAll('#tblQA a');

    fffQuestions = links.map(tag=>{

        const href = tag.getAttribute('href');

        return url + href;
    });

    parseFFFQuestion(0);
}
const makeAnswer = (text,points) => {
    return {
        revealed : false,
        answered : false,
        answer : text,
        points
    };
}
const fffQuestionParser = (html,url) => {

    const root = parse(html);
    const answers = root.querySelectorAll('#DataGridQADetail tr');
    
    
    //take off the title row
    answers.shift()

    const question = cloneDeep(questionSchema,true);

    if(answers.length >= minAnswers)
    {
        const questionNode = root.querySelector('caption');

        question.question = questionNode.innerText.trim();
        question.ID = questions.length;
        question.answers = [];

        answers.forEach(answer=>{
    
            const tds = answer.querySelectorAll('td');
            const text = tds[0].childNodes[0].innerText.trim();
            const points = Number(tds[1].childNodes[0].innerText.trim());

            if(text === '' || points === 0)
            {
                //console.log('skipping blank answer');
            }
            else
            {
                //console.log(text,points);
                question.answers.push(makeAnswer(text,points));
            }
                
        });

        if(question.answers.length >= minAnswers)
            questions.push(question);
    }
    
    if(question.answers.length < minAnswers || answers.length < minAnswers)
    {
        console.log('skipping',url,'not enough answers');
    }
}

const allIDs = () => questions.map(q => q.answers.map(a=>a.ID)).flat()

const parseFFFQuestion = i => {

    const url = fffQuestions[i];

    if(url !== undefined)
    {
        axios.get(url).then(resp=>{
            console.log('parsing',url);
            fffQuestionParser(resp.data,url);
            parseFFFQuestion(i + 1);
        })
    }
    else
    {
        fs.writeFileSync(`${dataDir}/real-questions.json`,JSON.stringify(questions));
    }
}

const parseSource = i => {

    const source = sources[i];

    if(source !== undefined)
    {
        axios.get(source.url).then(resp => {
            source.parser(resp.data,source.url);
            curSource = i + 1
        });
    }
}

let curSource = 0;

const questions = [];

const sources = [
    {
        url : "http://familyfeudfriends.arjdesigns.com/",
        parser : parseFamilyFeudFriends
    }
]


parseSource(0);
