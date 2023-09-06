var survey;
var json = {};
var chartData = {};

function generateResultsHTML(surveyModel) {
    var results = "";

    //add score text
    results = `<div class='score-text'>${calculateScoreText(surveyModel)}</div>`;

    results += `<div class="chart-container"><canvas id="myChart" width="100%" height="100%"></canvas></div>`;

    chartData = {
        labels: [],
        datasets: [
            {
                // label: "Your results (closer to the edge is better)",
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBackgroundColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(179,181,198,1)",
                data: []
            }
        ]
    };;

    //loop through pages and get the questions
    for (let i = 0; i < surveyModel.pages.length; i++) {
        const page = surveyModel.pages[i];
        results += `<div class='page-details'><h3>${page.jsonObj.name}</h3>`;

        chartData.labels.push(page.jsonObj.name);

        //for the current page calculate number of correctanswers
        var correctAnswerCount = 0;
        var possibleCorrectAnswerCount = 0;
        for (let j = 0; j < page.elements.length; j++) {
            const question = page.elements[j];
            //if question has a correct answer
            if (question.correctAnswer) {
                possibleCorrectAnswerCount++;

                if (question.isAnswerCorrect()) {
                    correctAnswerCount++;
                }
            }
        }

        if (possibleCorrectAnswerCount == 0) {
            //if there are no correct answers, then set the correct answer count to the number of questions
            //possibleCorrectAnswerCount = page.elements.length;

            chartData.datasets[0].data.push(100);
        }
        else {
            //calculate percentage of correct answers for the question
            const correctAnswerPercent = Math.round((correctAnswerCount / possibleCorrectAnswerCount) * 100);
            chartData.datasets[0].data.push(correctAnswerPercent);
        }
        //loop through all questions in the page
        for (let j = 0; j < page.elements.length; j++) {

            const question = page.elements[j];
            const questionNumber = question.no;
            const questionText = question.fullTitle;
            const questionAnswer = question.displayValue;
            const questionComment = question.comment;
            const helpURL = question.jsonObj.helpURL;
            const helpURLTitle = question.jsonObj.helpURLTitle || "More Info";

            var questionDetails = "";

            const questionClass = question.isAnswerCorrect() ? "correct-answer" : "wrong-answer";

            //add the question text and answer to the results
            questionDetails += `<div class='question-details ${questionClass}'>${questionNumber} ${questionText}: ${questionAnswer}`;
            if (questionComment && questionComment.length > 0)
                questionDetails += `, ${questionComment}`;
            if (helpURL && helpURL.length > 0)
                questionDetails += `<a href=${helpURL} target='_blank'>${helpURLTitle}</a>`;

            questionDetails += "</div>";

            results += questionDetails;
        }
        results += "</div>";
    }
    surveyModel.completedHtml = results;
}

function resetSurvey(surveyModel) {
    if (confirm('This will reset the survey and you will lose all answers. Are you sure?')) {
        location.reload();
    }
}

function calculateScoreText(surveyModel) {
    const questions = surveyModel.getAllQuestions();

    var score = 0;
    //because some questions do not have an answer, we need to calculate the max score 
    var maxScore = surveyModel.getCorrectAnswerCount() + surveyModel.getInCorrectAnswerCount();
    var scoreText = "";

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        //if there is a correct answer, then check if it is correct
        if (question.isAnswerCorrect()) {
            score++;
        }
    }

    //calculate percentage of maxScore
    const scorePercent = Math.round((score / maxScore) * 100);

    var scoreImg = "";

    if (scorePercent >= 80) {
        scoreText = "Mature";
        scoreImg = "score-green.png";
    } else if (scorePercent >= 60) {
        scoreText = "Good";
        scoreImg = "score-yellow.png";
    } else if (scorePercent >= 40) {
        scoreText = "Fair";
        scoreImg = "score-red.png";
    } else {
        scoreText = "Developing";
        scoreImg = "score-red.png";
    }

    return `<img src='${scoreImg}' alt="${scorePercent}%"/> Your rating is <span title='${scorePercent}%'>${scoreText}</span>`;
}


// read querystring param assessment
const urlParams = new URLSearchParams(window.location.search);
var assessmentName = urlParams.get('assessment');
assessmentName = assessmentName || "emu"; //default to emu



$.getJSON({
    url: assessmentName + "/survey.json",
    success: function (result) {
        json = result;

        //  check if pages are defined in the json and have more than 0
        if (json.pages && json.pages.length > 0) {
            setupSurveyFromJson(json);
        }
        else {

            Papa.parse(assessmentName + '/questions.csv', {
                download: true,
                header: true,
                complete: function (results) {
                    json.pages = [];
                    var page = [];

                    for (let i = 0; i < results.data.length; i++) {
                        const question = results.data[i];
                        console.log(question);

                        if (question.page != page.name) {
                            page = [];
                            page.name = question.page;
                            page.elements = [];
                            json.pages.push(page);
                        }

                        page.elements.push(question);
                    }

                    setupSurveyFromJson(json);
                }
            }
            );

        }
    }
});


function setupSurveyFromJson(json) {
    survey = new Survey.Model(json);
    survey.applyTheme(themeJson);

    console.log(JSON.stringify(json));

    survey.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3));

        //after a delay, generate the chart
        setTimeout(function () {generateChart()}, 500);

        //after a delay, scroll to top
        setTimeout(function () {window.scrollTo(0, 0);}, 1000);

        $("#btnReset").show();
        $("#btnExport").show();
    });

    //reset answers
    survey.data = {};

    survey.onValidateQuestion.add((survey, options) => {
        if (survey.completedHtmlOnCondition.length == 0) {
            generateResultsHTML(survey);
        }
    });

    $("#surveyElement").Survey({ model: survey });
}

function exportSurvey() {
    // export the survey to csv

    //get all questions
    const questions = survey.getAllQuestions();

    //build a new list of value of jsonObj in each question
    var questionsList = [];
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        obj = question.jsonObj;
        // obj.isAnswerCorrect = question.isAnswerCorrect();
        obj.answer = question.displayValue;
        questionsList.push(question.jsonObj);
    }

    var csv = Papa.unparse(questionsList);

    //generate filename based on date yyyy-mm-dd and time hh-mm-ss
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var time = d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
    var fileName = survey.title + "-" + date + "-" + time + ".csv";

    //return the csv to the user via the browser
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


}


function generateChart() {
    var ctx = document.getElementById("myChart");

    //return if ctx is null or undefined
    if (!ctx) return;

    var options = {
        tooltips: {
            mode: 'label'
        },
        layout: {
            padding: 20
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'rgb(255, 99, 132)'
                }
            }
        }
    };
    var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: chartData,
        options: options
    });
}