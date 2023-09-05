# GH Assessment
A browser only assessment and quiz tool. 

These are not an official GitHub assessments and is not endorsed by GitHub.

## Live demos

### GitHub Enterprise Cloud Assessment
A live demo of the GitHub Enterprise Cloud  assessment is available at [stuarteggerton.com/gh-assessment](https://stuarteggerton.com/gh-assessment)  - helps you understand if you have considered some key points when configuring GitHub.
  
The questions for the survey are based on a [list](https://gist.github.com/gitstua/0bd15c1c6e87e947010906bacc749376) I put together for a customer using GitHub Enterprise Cloud EMU to consider to improve security and management.

### A GitHub Actions Assessment
A demo of the content provided by @yuhattor is located at [stuarteggerton.com/gh-assessment/?assessment=actions](https://stuarteggerton.com/gh-assessment/?assessment=actions)

### Quiz on GitHub Foundations
A quiz for foundational knowledge about GitHub is available at [stuarteggerton.com/gh-assessment/?assessment=quiz-foundations](https://stuarteggerton.com/gh-assessment/?assessment=quiz-foundations)


## How was this built
This was built using [github.com/surveyjs/survey-library](https://github.com/surveyjs/survey-library) and is a single page application.  The survey is defined in `questions.csv` and the results are processed in `index.js`.

Custom attributes was added for `helpURL` and `helpURLTitle` which are used to link to the help page for each question in the results tab.

Scoring is based upon if the answer matches the correctAnswer column next to each question in the CSV.

For the **quiz** example - this defines more complex question structure directly in the `survey.json` file.

## To update questions
1. Edit questions.csv - avoid commas at this stage since this may break things
2. Test locally

## To add a complete new assessment
1. Copy an existing folder e.g. emu
2. Update the title and description
3. Update the questions.csv
4. Request the survey by adding the query string `assessment` to load the survey e.g. [stuarteggerton.com/gh-assessment/?assessment=emu](https://stuarteggerton.com/gh-assessment/?assessment=emu)

## Todo
- [ ] Consider local browser storage for the results so that they can be saved as the questions are answered and reloaded.
- [ ] Add more surveys and questions
- [ ] Add a way to store the results
- [ ] Verify accessibility

## Privacy
No content leaves your browser. 

## Thanks
 - [SurveyJS](https://github.com/surveyjs/survey-library) for the survey framework
 - [Papa Parse](https://www.papaparse.com/) for the CSV to JSON conversion end CSV export
 - [ChartJS](https://www.chartjs.org/docs/latest/) for the graphing
 - GitHub Copilot helped with some of the code and this readme 😍