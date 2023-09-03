# GH Assessment
A browser only assessment to help you understand if you have considered some key points when configuring GitHub. The questions are based on a [list](https://gist.github.com/gitstua/0bd15c1c6e87e947010906bacc749376) I put together for a customer using GitHub Enterprise Cloud EMU .

## How was this built
This was built using [github.com/surveyjs/survey-library](https://github.com/surveyjs/survey-library) and is a single page application.  The survey is defined in `questions.csv` and the results are processed in `index.js`.

A custom attribute was added for `helpURL` which is used to link to the help page for each question in the results tab.

## To update questions
1. Edit questions.csv - avoid commas at this stage since this may break things
2. Test locally

## Todo
- [ ] Consider local browser storage for the results so that they can be saved as the questions are answered and reloaded.
- [ ] Add more questions
- [ ] Add a way to store the results

## Privacy
No content leaves your browser. 

## Thanks
 - [SurveyJS](https://github.com/surveyjs/survey-library) for the survey framework
 - [Papa Parse](https://www.papaparse.com/) for the CSV to JSON conversion