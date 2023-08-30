function generateResults(surveyModel) {
    // get the data from survey
    // const results = JSON.stringify(surveyModel.data);

    var results = "";
    //get all questions
    const questions = surveyModel.getAllQuestions();

    //loop through all questions and get the question text and the question answer plus description
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionNumber = i + 1;
        const questionText = question.fullTitle;
        const questionAnswer = question.displayValue;
        const questionComment = question.comment;
        const helpURL = question.jsonObj.helpURL;
        const helpURLTitle = question.jsonObj.helpURLTitle || "More Info";
    
        //add the question text and answer to the results
        results += `<br/><br/>${questionNumber}. ${questionText}: ${questionAnswer}`;
        if (questionComment && questionComment.length > 0)
            results += `, ${questionComment}`;
        if (helpURL && helpURL.length > 0)
            results += `<br/><a href=${helpURL}>${helpURLTitle}</a><br/>`;
    }

    surveyModel.jsonObj.completedHtml = results;

    //set the results into the div
    document.getElementById('surveyResults').innerHTML = results;
    $("#surveyResults").show();
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

$("#surveyElement").Survey({ model: survey });

