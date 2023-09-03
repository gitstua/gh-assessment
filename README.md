# GH Assessment
A browser only assessment to help you understand if you have considered some key points when configuring GitHub. The questions for the EMU survey are based on a [list](https://gist.github.com/gitstua/0bd15c1c6e87e947010906bacc749376) I put together for a customer using GitHub Enterprise Cloud EMU to consider to improve security and management.

This is not an official GitHub assessment and is not endorsed by GitHub.

## Live demo
You can see a live demo on my website [stuarteggerton.com/gh-assessment](https://stuarteggerton.com/gh-assessment/)

## How was this built
This was built using [github.com/surveyjs/survey-library](https://github.com/surveyjs/survey-library) and is a single page application.  The survey is defined in `questions.csv` and the results are processed in `index.js`.

Custom attributes was added for `helpURL` and `helpURLTitle` which are used to link to the help page for each question in the results tab.

Scoring is based upon if the answer matches the correctAnswer column next to each question in the CSV.

## To update questions
1. Edit questions.csv - avoid commas at this stage since this may break things
2. Test locally

## To add a complete new assessment
1. Copy an existing folder e.g. emu
2. Update the title and description
3. Update the questions.csv
4. Request the survet by adding the query string `assessment` to load the survey e.g. [stuarteggerton.com/gh-assessment/?assessment=emu](https://stuarteggerton.com/gh-assessment/?assessment=emu)

## Todo
- [ ] Consider local browser storage for the results so that they can be saved as the questions are answered and reloaded.
- [ ] Add more surveys and questions
- [ ] Add a way to store the results
- [ ] Verify accessibility

## Privacy
No content leaves your browser. 

## Thanks
 - [SurveyJS](https://github.com/surveyjs/survey-library) for the survey framework
 - [Papa Parse](https://www.papaparse.com/) for the CSV to JSON conversion