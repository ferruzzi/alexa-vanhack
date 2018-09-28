/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* jslint esversion: 6 */

const Alexa = require('ask-sdk-core');
var rp = require('request-promise');

const noList = ["Sorry", "Unfortunately", "Sadly", "Alas", "I\'m sad to say that", "Out of luck", "No", "Nope", "What a bummer", "My magic eight ball says"];
const yesList = ["Yes", "Thankfully", "Indeed", "Yup", "I\'m happy to report that", "In fact", "Luckily", "What do you know", "Look at that", "Your stars have aligned", "Sure"];

function getWebRequest(url) {
    let params = {
        uri: url
    };

    return rp(params).then(function (response) {
        if (typeof response != 'object')
            response = JSON.parse(response);

        if (response.error) {
            throw new Error(response.error.message);
        } else {
            return response;
        }
    }).catch(function (err) {
        return err;
    });
}

function randReply(options) {
    i = Math.floor(Math.random() * options.length);

    return (options[i]);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hack the planet!  I am here to check in on the hackspace for you.  You can ask me if the space is open, or if certain pieces of equipment are currently in use.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('VHS', speechText)
            .getResponse();
    },
};

const IsVHSOpenIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'IsVHSOpenIntent';
    },
    handle(handlerInput) {
        let url = "https://api.vanhack.ca/s/vhs/data/door.json";

        return getWebRequest(url).then(function (data) {
            var doorStatus = data.value;

            switch (doorStatus) {
                case 'open':
                    return randReply(yesList) + ', we are ' + doorStatus;
                case 'closed':
                    return randReply(noList) + ', we are ' + doorStatus;
                default:
                    return "I'm not really sure if the space is open or not! Better check isvhsopen.com!";
            }
        }).catch(function (err) {
            return "An error occured! The error was " + err;
        }).then(function (speechText) {
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('VHS', speechText)
                .getResponse();
        });
    }
};

const EquipmentUseIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'EquipmentUseIntent';
    },
    handle(handlerInput) {
        let url = "https://api.vanhack.ca/s/vhs/data/laser.json";

        return getWebRequest(url).then(function (data) {
            const EquipmentStatus = data.value;
            return 'Currently the laser is ' + EquipmentStatus;
        }).catch(function (err) {
            return "An error occured! The error was " + err;
        }).then(function (speechText) {
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard('VHS', speechText)
                .getResponse();
        });
    },
};

const HelloIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
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
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
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
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
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