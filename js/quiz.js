const quiz = document.getElementById('quiz');
const questionElement = document.getElementById('question');
const correct_answer = document.getElementById('correct_answer');
const questions = document.getElementById('questions');
const nextBtn = document.getElementById('next');
const quizBody = document.getElementById('quizBody');
const statusBar = document.getElementById('statusBar')
const quizResult = document.getElementById('quizResult');
const quitForm = document.getElementById('quizQuit');
var statusBarItems = document.querySelectorAll(".item");
var answerElements = document.querySelectorAll('.answer');
var currentQuizData = '';
var data = {};



let currentQuiz = 0;
let score = 0;


document.addEventListener("DOMContentLoaded", function() {
    loadQuiz();
});

function loadQuiz(){
    deselectAnswers();
    currentQuizData = quizData[currentQuiz];
    renderQuestions();
    deselectAnswers();
    processData();
}

function processData(){
    answerElements = document.querySelectorAll('.answer');
    answerElements.forEach(answerEl => {
        if (answerEl.classList.contains('answer-textarea')){
            answerEl.nextElementSibling.addEventListener('focus', (el) => {
                saveAnswer('textarea', answerEl.id)
            });
            answerEl.nextElementSibling.addEventListener('input', (el) => {
                saveAnswer('textarea', answerEl.id)
            });
        }else{
            answerEl.addEventListener('click', (el) => {
                saveAnswer('input', el.target.id)
            });
        }
    });
}

function showQuitForm(){
    quizBody.style.display = 'none';
    quitForm.classList.add('show');
    questions.innerHTML = '';
}

function saveAnswer(columnClass, answer){
    let answerText = '';
    let nextBtn = document.getElementById('next');
    let isChecked = document.getElementById(answer).checked;
    let curid = currentQuizData.id;
    
    if (answer){
        const nextElement =  document.getElementById(answer).nextElementSibling;
        answerText = (columnClass == 'textarea') ? nextElement.value : nextElement.innerHTML.replace(/\n|<.*?>/g,'');

        if (currentQuizData.type == 'multiple-choice') {
            if(isChecked && answerText != ''){
                if (data[curid] == null) { data[curid] = new Object(); } 
                data[curid][answer] = answerText;
            }else if (answerText != ''){
                delete data[curid][answer];
            }
        } else {
            data[currentQuizData.id] = answerText;
        }

        nextBtn.classList.add('active');
    } 
}

const renderQuestions = () => {

    const inputType = (currentQuizData.type == 'multiple-choice') ? 'checkbox' : 'radio';

    const renderStatusBar = () => quizData.map((item, index) => `
        <div class="${(currentQuiz == index) ? 'item active' : 'item'}"></div>
    `).join('');

    const renderAnswers = () => {
        return currentQuizData.answers.map((answer, index) => {
            if (answer == 'open_answer')
                return `<li class="wide">
                        <input type="${inputType}" name="answer" id="answer-${index}" class="answer answer-textarea">
                        <textarea onfocus="deselectAnswers(this)" name="answer" id="answer-${index}_text" cols="30" maxlength="30" placeholder="Свой вариант" rows="1"></textarea>
                    </li>`;
            return `<li>
                        <input type="${inputType}" name="answer" id="answer-${index}" class="answer">
                        <label for="answer-${index}" id="answer-${index}_text" class="btn-mini">${answer}</label>
                    </li>`;
        }).join('');
    }

    quizBody.innerHTML = `
        <div id="statusBar" class="status-bar">${renderStatusBar()}</div>
        <h2 id="question">${currentQuizData.question}</h2>
        <ul id="questions" class="${currentQuizData.columnClass}">${renderAnswers()}</ul>
        <button id="next" class="btn">Далее<img src="img/arrow.svg" alt="next"></button>
    `;
}



function deselectAnswers(item){
    if (item) {
        item.previousElementSibling.checked = true;
    } else {
        for (var answer of answerElements) {
            answer.checked = true;
        }
    }
}



function getSelected(){
    let answer;
    answerElements = document.querySelectorAll('.answer');
    answerElements.forEach(answerEl => {  
        if (!answerEl.classList.contains('answer-textarea')){
            if(answerEl.checked){
                answer = answerEl.id;
            }
        }else{
            if(answerEl.checked && answerEl.nextElementSibling.value != ''){
                answer = answerEl.id;
            }
        }
    });
    return answer;
}

quizBody.addEventListener('click', (event) => {
    if(event.target.id == 'next'){
        const answer = getSelected();
        if(answer){
            event.target.classList.remove('active');
            if (data[currentQuiz+1] == quizData[currentQuiz].quitAnswer){
                showQuitForm();
            }
            set_scenario();
            if (currentQuiz < quizData.length-1){
                while (quizData[currentQuiz+1].state != 'show' ) {
                    currentQuiz++;
                }
            }
            currentQuiz++;
            if(currentQuiz < quizData.length){
                loadQuiz();
            }else{
                quizResult.style.display = 'block';
                quizBody.style.display = 'none';
            }
            sendData()
        } 
    }
});


function set_scenario(){
    for (var item in scenario) {
        let questions = scenario[item];

        for (var question in questions) {
            let answers = questions[question];
           
            if ((currentQuiz+1) == question){ //Если вопрос есть в сценарии:
                for (var answer in answers) {
                    let questionsToChange = answers[answer];
                    let scenarioAnswer = quizData[currentQuiz].answers[answer-1];
                    let currentAnswer = data[currentQuiz+1];
                    if (currentAnswer == scenarioAnswer){

                        for (var questionToChange in questionsToChange){
                            let element = questionToChange;
                            let state = questionsToChange[questionToChange].state;

                            if (state == 'hide'){
                                hide(element);
                            }
                        }

                    } 
                }
            }
        }
    }
}

function hide(element){
    quizData[element-1].state = 'hide';
}


function sendData(){
    var senddata = new Object;
    var subAnswers = new Array;
    for (var prop in data) {
        if (typeof data[prop] === 'object' && data[prop] !== null){
            result = Object.keys(data[prop]).map((key) => data[prop][key]);
            subAnswers.push(result)
            data[prop] = subAnswers.toString();
        }
    }

    Object.keys(data).map(function(key, index) {
        senddata['answer-'+key] = data[key];
    });


    console.log(senddata);
    
    // let redirect_link = '%%=CloudPagesURL(1620,'Id',@id,'utm_source',@utm_source,'utm_medium',@utm_medium,'utm_campaign',@utm_campaign,'landing_name',@landing_name)=%%'
    // $.ajax({
    //   url: redirect_link,
    //   data: senddata,
    //   type: 'POST',
    //   success: function (r) {
    //     console.log('Ok'); 
    //     console.log(senddata); 
    //   }
    // });
}
