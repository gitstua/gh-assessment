function generateResults(surveyModel) {
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

    //set the results into the div
    // document.getElementById('surveyResults').innerHTML = results;
    // $("#surveyResults").show();
}

function calculateScoreText(surveyModel){
    const questions = surveyModel.getAllQuestions();

    var score = 0;
    var maxScore = questions.length +1;
    var scoreText = "";

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
    
        if (question.displayValue == "Yes"){
            score++;
        }
    }

    //calculate percentage of maxScore
    const scorePercent = Math.round((score/maxScore)*100);

    if (scorePercent >= 80){
        scoreText = "Mature";
    } else if (scorePercent >= 60){
        scoreText = "Good";
    } else if (scorePercent >= 40){
        scoreText = "Fair";
    } else {
        scoreText = "Developing";
    } 

    return `Your rating is <span title='${scorePercent}%'>${scoreText}</span>`;
}

const survey = new Survey.Model(json);
// You can delete the line below if you do not use a customized theme
survey.applyTheme(themeJson);
survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));

    generateResults(survey);
});
survey.data = {
};

survey.onValidateQuestion.add((survey, options) => {
    generateResults(survey);
});

$("#surveyElement").Survey({ model: survey });

