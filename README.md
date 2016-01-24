Draw With Me
======
A web app that allows creations of public and private rooms where you can upload art.  

## TODO
--------
* CRUD(Create, Read, Update, Delete) of images to the database
  * Image uploading
    * ~~Basic image uploading~~
    * Restrict image filetype
* User Authentication
  * ~~User Registration~~
  * ~~User Sessions~~
  * ~~CSRF protection for login/register forms~~
  * ~~Basic User Dashboard~~
  * OAuth through google, reddit, github.
* User Authorization
* Room creation
  * Slugify room urls
  * URL generation for rooms
  * Generate private room keys
  * Room authorization restrictions

## CRUD, Schema Design  
### Misc Notes
  When updating the schema you can either make it so  

  * the older documents are updated as you go along.(via a method in the update requests).
  * Write a script that converts all the old documents into the newer one.
  * In development you probably just scrap the table entirely multiple times.
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
  * messsages
* Location
* Time zone

#### Messsages
* author
* recipient
* title
* body
* date

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
    * public/private
    * title
    * Body
    * Date
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

### Tags
* name
* description
