var watson = require('watson-developer-cloud');

function main(args) {
    // hardcoded input text to Analyze
    var userInput = 'ok fine, I will look into the issue but dont call me again.';

    // To create your Watson Tone Analyzer keys, head over to Bluemix and create the Tone Analyzer service
    var tone_analyzer = watson.tone_analyzer({
        username: '<username>',
        password: '<password>',
        version: 'v3',
        version_date: '2016-05-19'
    });

    // Function that returns the response expected by Alexa with the text been analyzed
    return new Promise( (resolve, reject) => {
        tone_analyzer.tone({text:userInput}, (err, tone) => {
            if(err){
                return reject(err);
            }else{
                tone.document_tone.tone_categories[0].tones.forEach(function(entry) {
                    if(entry.score >= 0.5){
                        var toneRes = entry.score + '% chances that the tone of this text is in the category of: ' + entry.tone_name;
                        console.log(toneRes);
                        var response = {
                            "version": "1.0",
                            "response" :{
                                "shouldEndSession": true,
                                "outputSpeech": {
                                    "type": "PlainText",
                                    "text": toneRes
                                }
                            }
                        };
                    };
                    return resolve(response);
                });
            }
        });
    });
}

exports.main = main;