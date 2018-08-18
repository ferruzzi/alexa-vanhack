# alexa-vanhack

## An Alexa skill to tie into the VHS API for door and equipment status. 

### Currently supported:
* Alexa, ask VHS if they are open
* Alexa, ask VHS if the laser is free

### Current Issues:
There is a bug with the speechText always responding to the previous utterance.  To reproduce:

Utterance:  Ask VHS if they are open
Response: Sorry, I didn't understand the command.
U: Ask VHS if they are open
R: Yes, we are open
U: Ask VHS if the laser is free
R: Yes we are open
U: Ask VHS if they are open
R: The laser is currently off

I think the issue is a scope issue with the getWebRequest function returning speechText
