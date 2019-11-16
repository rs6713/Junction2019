var Twitter = require('twitter');
var config = require('./../config/config');

const Vision = require('azure-cognitiveservices-vision');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;

var tw = new Twitter(config.twitterConfig);


// https://codeburst.io/build-a-simple-twitter-bot-with-node-js-in-just-38-lines-of-code-ed92db9eb078
// TODO: made hashtag configurable instead of hardcoding after hackathon

// Set up your search parameters
var params = {
    q: '#junction2019',
    count: 10,
    result_type: 'recent',
    lang: 'en'
}



const getTweets = (request, response) => {

    const hashtag = request.params.id;

    tw.get('search/tweets', params, function (err, data, res) {
        if (!err) {

            //send all tweets to the user
            //response.status(200).json(data.statuses);

            var filteredTweets = [];

            // Loop through the returned tweets
            for (let i = 0; i < data.statuses.length; i++) {
                

                try {

                    if (true) {
                    // TODO: Fix error: azureModeration(data.statuses[i].text)) {
                        
                        var tweet =
                        {
                            id: data.statuses[i].id_str,
                            tweet: data.statuses[i].text,
                            whole: data.statuses[i]
                        };

                        if (data.statuses[i].user) { 
                            tweet.name = data.statuses[i].user.name
                            tweet.handle = data.statuses[i].user.screen_name
                            tweet.image = data.statuses[i].user.profile_image_url                            
                        }

                        filteredTweets.push(tweet);

                    }

                } catch (error) {

                }


            }

            response.status(200).json(filteredTweets);


        } else {
            console.log(err);
            response.sendStatus(500);
        }
    });

};

//service key
let credentials = new CognitiveServicesCredentials("eb9c01deeba84c2e902c420ac062610f");

// Add your Azure Content Moderator endpoint to your environment variables.
let contentModeratorApiClient = new Vision.ContentModeratorAPIClient(credentials, "https://contentmoderatorjunction.cognitiveservices.azure.com/");

const azureModeration = function (text) {


    try {

        var screenResult = contentModeratorApiClient.textModeration.screenText("eng", "text/plain", text, {
            classify: true
        });

        //console.log(screenResult);

        // https://docs.microsoft.com/en-us/azure/cognitive-services/content-moderator/text-moderation-api
        // Higher score means higher changes of being explicit content
        return screenResult.Classification.Category1 < 0.75 && screenResult.Classification.Category2 < 0.75
            && screenResult.Classification.Category3 < 0.75;



    } catch (error) {
        console.log(error);
    }

    return true;


    // var params = {
    //     // Request parameters
    //     "autocorrect": "{boolean}",
    //     "PII": "{boolean}",
    //     "listId": "{string}",
    //     "classify": "True",
    //     "language": "{string}",
    // };

    // //TODO: Made them configurable 
    // var url= "https://westus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen?" + param(params),
    // var headers = {
    //     "Content-Type":"text/plain",
    //     "Ocp-Apim-Subscription-Key":"{subscription key}"        
    // };


    // request.post({ url: url, form: form, headers: headers }, function (e, r, body) {
    //     // your callback body
    // });
}


module.exports = {
    getTweets
};


