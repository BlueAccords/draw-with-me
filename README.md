Draw With Me
======
A web app that allows creations of public and private rooms where you can upload art.  

## TODO
--------
* CRUD(Create, Read, Update, Delete) of images to the database
* User Authentication
  * OAuth through google, reddit, github.
* User Authorization
* Room creation
  * Slugify room urls
  * URL generation for rooms
  * Generate private room keys
  * Room authorization restrictions

## CRUD, Schema Design
#### Users
* username
* password
* email
* rooms they own/created
* rooms they are members of
* personal collection
  * images
* friends
* inbox
  * messages
    * author
    * body
    * timestamp  

#### Rooms
* collections
  * (group can store images in there)
* owner
  * transferrable
* moderators
  * (mods can have similar privileges to owner)
* members
  * rank
    * permission levels to edit room
* events
  * allows scheduling of events
  * Ability to send out emails to members
* public/private
  * public allows public to view or public to contribute to.
  * owner can choose to authorize image uploads or not.
  * keys/passwords to join if private
  * link to room(allow custom slugs)  

### Images
* filename
* file size
  * limit file size(need to think of a max size)
* filetype
  * limit file types?
* date
* author  
* tags(important)
