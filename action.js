var watson = require('watson-developer-cloud');
// To create your Watson Tone Analyzer keys, head over to Bluemix and create the Tone Analyzer service
var tone_analyzer = watson.tone_analyzer({
    username: '4c792a31-1eaa-49ab-aeb5-c9b6cbb01fe1',
    password: 'bm3jD5yAjsHF',
    version: 'v3',
    version_date: '2016-05-19'
});
// array of quotes
var quotes = [
    "Life isn’t about getting and having, it’s about giving and being.",
    "Whatever the mind of man can conceive and believe, it can achieve.",
    "Strive not to be a success, but rather to be of value.", "Albert Einstein",
    "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.",
    "I attribute my success to this: I never gave or took any excuse.",
    "You miss 100% of the shots you don’t take.",
    "The most difficult thing is the decision to act, the rest is merely tenacity.",
    "happy wife means happy life"
];

// Function to return random value
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Return random quote
function randomQuote() {
    return quotes[getRandomInt(0, quotes.length-1)];
};

//OpenWhisk action, expects to return something
function main(args) {
    var intent = args.request.intent;
    var text = '';

    // Return to Alexa random quote
    if(intent.name === 'randomQuote') {
        text += randomQuote();
        var response = {
            "version": "1.0",
            "response" :{
                "shouldEndSession": true,
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "Here is a random Quote: " + text
                }
            }
        };
        return response;
    }

    // Return to Alexa a happy/Joy quote
    if(intent.name === 'happyQuote') {
        return new Promise( (resolve, reject) => {

            // loop over all the quotes
            quotes.forEach(function(quote){
                tone_analyzer.tone({text:quote}, (err, tone) => {
                    if(err){
                        return reject(err);
                    }else {
                        tone.document_tone.tone_categories[0].tones.forEach(function(entry) {


                            // check to find joy/happy quotes
                            if(entry.tone_name == "Joy" && entry.score >= 0.5){
                                text = "Here is a happy Quote that I found for you: " + quote;
                                console.log(tone);

                                var response = {
                                    "version": "1.0",
                                    "response" :{
                                        "shouldEndSession": true,
                                        "outputSpeech": {
                                            "type": "PlainText",
                                            "text": text
                                        }
                                    }

                                };
                                return resolve(response);
                            }
                        });
                    }
                });
            });
        });
    }



}

exports.main = main;