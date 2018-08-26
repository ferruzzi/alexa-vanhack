/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const https = require('https');

const noList = ["Sorry", "Unfortunately", "Sadly", "Alas", "I\'m sad to say that", "Out of luck", "No", "Nope", "What a bummer", "My magic eight ball says"];
const yesList = ["Yes", "Thankfully", "Indeed", "Yup", "I\'m happy to report that", "In fact", "Luckily", "What do you know", "Look at that", "Your stars have aligned", "Sure"];

function getWebRequest(url,doWebRequestCallBack) {
    https.get(url, function (res) {
        var webResponseString = '';

        if (res.statusCode != 200) {
            doWebRequestCallBack(new Error("Non 200 Response"));
        }

        res.on('data', function (data) {
            webResponseString += data;
        });

        res.on('end', function () {
            var webResponseObject = JSON.parse(webResponseString);
            if (webResponseObject.error) {
                doWebRequestCallBack(new Error(webResponseObject.error.message));
            } else {
                doWebRequestCallBack(null, webResponseObject);
            }
        });
    }).on('error', function (e) {
        doWebRequestCallBack(new Error(e.message));
    });
}

function randReply (options) {
    i = Math.floor(Math.random() * options.length);

    return(options[i]);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hack the planet!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const IsVHSOpenIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'IsVHSOpenIntent';
    },
    async handle(handlerInput) {
        let url = "https://api.vanhack.ca/s/vhs/data/door.json";

        await getWebRequest(url, function webResponseCallback(err, data) {
            if (err) {
                speechText = "Sorry I couldn't connect to the server: " + err;
            } else {
                const doorStatus = data.value;
                if (doorStatus === 'open') {
                    speechText = randReply(yesList);
                } else {
                    speechText = randReply(noList);
                }
                speechText += ', we are ' + doorStatus;
            }
        });

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const EquipmentUseIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'EquipmentUseIntent';
    },
    async handle(handlerInput) {
        let url = "https://api.vanhack.ca/s/vhs/data/laser.json";

        await getWebRequest(url, function webResponseCallback(err, data) {
            if (err) {
                const speechText2 = "Sorry I couldn't connect to the server: " + err;
            } else {
                const EquipmentStatus = data.value;
                speechText2 = 'Currently the laser is ' + EquipmentStatus;
            }
        });

        return handlerInput.responseBuilder
            .speak(speechText2)
            .withSimpleCard('VHS', speechText2)
            .getResponse();
    },
};

const HelloIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello Hacker!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!  Of course if you want to put me to work, you can ask if VHS is open as well.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Happy hacking!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I didn\'t understand the command. Please try again.')
            .reprompt('Sorry, I didn\'t understand the command. Please try again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        IsVHSOpenIntentHandler,
        EquipmentUseIntentHandler,
        HelloIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
