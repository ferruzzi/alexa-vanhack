# alexa-vanhack

## An Alexa skill to tie into the VHS API for door and equipment status. 

### Currently supported:
* Alexa, ask VHS if they are open
* Alexa, ask VHS if the laser is free

### Current Issues:
There is currently a bug where the skill always responds to the previous utterance, not the most recent.  To reproduce:

* Utterance:  Ask VHS if they are open
* Response: Sorry, I didn't understand the command.
* U: Ask VHS if they are open
* R: Yes, we are open
* U: Ask VHS if the laser is free
* R: Yes we are open
* U: Ask VHS if they are open
* R: The laser is currently off

I think there is a scope issue with the getWebRequest function returning speechText
