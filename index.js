function generateResultsHTML(surveyModel) {
    // get the data from survey
    // const results = JSON.stringify(surveyModel.data);

    var results = "";
    //get all questions
    const questions = surveyModel.getAllQuestions();

    //add score text
    results = `<div class='score-text'>${calculateScoreText(surveyModel)}</div>`;

    //loop through all questions and get the question text and the question answer plus description
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionNumber = i + 1;
        const questionText = question.fullTitle;
        const questionAnswer = question.displayValue;
        const questionComment = question.comment;
        const helpURL = question.jsonObj.helpURL;
        const helpURLTitle = question.jsonObj.helpURLTitle || "More Info";

        var questionDetails = "";

        //add the question text and answer to the results
        questionDetails += `<div class='question-details'>${questionNumber}. ${questionText}: ${questionAnswer}`;
        if (questionComment && questionComment.length > 0)
            questionDetails += `, ${questionComment}`;
        if (helpURL && helpURL.length > 0)
            questionDetails += `<a href=${helpURL} target='_blank'>${helpURLTitle}</a>`;

        questionDetails += "</div>";

        results += questionDetails;
    }

    surveyModel.completedHtml = results;

}

function calculateScoreText(surveyModel) {
    const questions = surveyModel.getAllQuestions();

    var score = 0;
    var maxScore = questions.length + 1;
    var scoreText = "";

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        if (question.displayValue == "Yes") {
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

var survey;

// read querystring param assessment
const urlParams = new URLSearchParams(window.location.search);
var assessmentName = urlParams.get('assessment');
assessmentName = assessmentName || "emu"; //default to emu

var json = {};

$.getJSON({
    url: assessmentName + "/survey.json",
    success: function (result) {
        json = result;

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

                survey = new Survey.Model(json);
                survey.applyTheme(themeJson);

                survey.onComplete.add((sender, options) => {
                    console.log(JSON.stringify(sender.data, null, 3));
                });

                //reset answers
                survey.data = {
                };

                survey.onValidateQuestion.add((survey, options) => {
                    generateResultsHTML(survey);
                });

                $("#surveyElement").Survey({ model: survey });
            }
        }
        );
    }
});


