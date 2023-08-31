#cat questions.csv | python3 ./convert.py > questions.json 
import csv, json, sys; 

# read stdin into a variable
input_data = sys.stdin.read()

# remove BOM if present
if input_data.startswith('\ufeff'):
    input_data = input_data[1:]

# create a reader from the input data
reader = csv.DictReader(input_data.splitlines())

# convert the reader to a list of dictionaries and output as JSON
results = json.dumps([dict(row) for row in reader], indent=2)

# remove \ufeff from start of results if present
results = results.replace('\ufeff', '')

# add multiline string names prefix
prefix = '''
const json = {
  "logoPosition": "right",
  "progressBarType": "questions",
  "showProgressBar": "top",
    "title": "GitHub Enterprise EMU Health Assessment",
    "description": "An unofficial health assessment for GitHub Enterprise",
"pages": [
   {
    "name": "Page1",

    "elements": 
'''

suffix = '''
   }
  ]
 }
'''

print(prefix + results + suffix)