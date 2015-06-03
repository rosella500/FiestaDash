// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));

// Get last 50 tweets at me
var secondMentionSearch = {count: 50, since_id: 606175411450605600};
var sinceID = 606175411450605600;

function getMoreMentions() {
	T.get('statuses/mentions_timeline', secondMentionSearch, function (error, data) {
	  // log out any errors and responses
	  //console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
      
      for(c=0; c<data.length;c++)
      {
        if(data[c].id>sinceID)
          sinceID = data[c].id;
        
        var username = data[c].user.screen_name;
        var replyID = data[c].id_str;
        
        var text = '@'+username+" I have noticed you.";
        
        console.log('Processing tweet: '+data[c].text);
        
        var ms = 1000; //Hacky delay
        ms += new Date().getTime();
        while (new Date() < ms){}
        
        tweet(text, replyID, username);
        
      }
      
      secondMentionSearch.since_id = sinceID;
      console.log('Max since_ID = '+sinceID);
    }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your search:', error);
	  }
	}); 
}

function tweet(textToTweet, replyID, sn)
{
T.post('statuses/update', {status: textToTweet, in_reply_to_status_id: replyID}, function(error, response){
  if (response) {
				console.log('Successfully tweeted at '+sn+': '+textToTweet);
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
}) ;
}

// Try to reply as soon as we start the program
getMoreMentions();
// ...and then every some minutes after that. Time here is in milliseconds

setInterval(getMoreMentions, 1000 * 60 * 1.5) ;
