# GH Assessment
A browser only assessment to help you understand if you have considered some key points when configuring GitHub.

## How was this built
This was built using [github.com/surveyjs/survey-library](https://github.com/surveyjs/survey-library) and is a single page application.  The survey is defined in `json.js` and the results are processed in `index.js`.

A custom attribute was added for `helpURL` which is used to link to the help page for each question in the results tab.

## To update questions
1. Edit questions.csv
2. run `./generateQuestionsFromCsv.sh` (this requires python3 and should create json.js)

## Todo
- [ ] Add some way of scoring the results. Maybe yes = 1 point and no = 0 points?
- [ ] Consider local browser storage for the results so that they can be saved as the questions are answered and reloaded.
- [ ] Add more questions
- [ ] Add a way to store the results

## Privacy
No content leaves your browser. 

## Thanks
 - [SurveyJS](https://github.com/surveyjs/survey-library) for the survey framework
 - Peter Koppstein for this [post](https://stackoverflow.com/a/44781106)