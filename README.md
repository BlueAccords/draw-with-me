Draw With Me
======
A web app that allows creations of public and private rooms where you can upload art.  

## Misc Notes
You should also try to make your models independent from the outside world. They don’t need to know about other models and they should never include them. They don’t need to know about controllers or who uses them. They should never receive request or response objects. They should never return http errors, but they should return model specific errors.


## TODO
--------
* CRUD(Create, Read, Update, Delete) of images to the database
  * Image uploading
    * ~~Basic image uploading~~
    * Restrict image filetype
* ~~User Authentication~~
  * OAuth through google, reddit, github.
* User Authorization
* Room creation
  * Slugify room urls
  * URL generation for rooms
  * Generate private room keys
  * Room authorization restrictions
  * ~~Users can join rooms~~
    * Room owners must approve requests
    * Room owners can invite others via email.
## ACCESS CONTROL DESIGN  

### Users  

#### Admin  
  * Studios
    * Create
    * Read
    * Update
    * Delete
    * Images belonging to studio
      * Create
      * Read
      * Update
      * Delete
  * User Accounts
    * Create
    * Read
    * Update
    * Delete
  * galleries(Image galleries, separate?)
    * Create
    * Read
    * Update
    * Delete
  * User Profiles
    * Delete
  * Private User Profiles
    * View(full view)
    * Delete  


#### Registered User
  * User profiles
    * View
  * Private User Profiles
    * View(minimal info)
  * Owned User Profile
    * Read
    * Update(profile info)
    * Delete
  * Public Studios
    * Read
  * Studios owned by User
    * Read
    * Update
    * Delete
    * Images
      * Create(Upload)
      * Read(View)
      * Update(edit meta info)
      * Delete
  * Studios the user belongs to
    * Read(view)
    * Images belonging to studio
      * Read(View)
    * Images belonging to user
      * Create(Upload)
      * Read(view)
      * Update(edit info)
      * Delete(Delete own images)
    * Public Studios(User does not belong to)
      * View
      * Images
        * View
    * Private Studios
      * NO ACCESS(view landing page, request invite at most)
    * galleries(owned)
      * Create(upload images)
      * Read
      * Update
      * Delete  


#### Unregistered User
  * Public Studios
    * Read
  * Private Studios
    * NO ACCESS(landing page only)
  * User Profiles
    * View
  * Private User Profiles
    * View (minmal info)
## CRUD, Schema Design  

#### Users
* username
* password
* email
* rooms they own/created
* rooms they are members of
* personal gallery
  * images
* friends
* inbox
  * messages
    * author
    * body
    * timestamp
* Location
* Time zone
* roles  


#### Rooms
* galleries
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

#### galleries(May not be necessary?)
A gallery would store a group of images. This may be necessary if Groups
want to sort their images by events(one gallery per event and such). but
for a MVP(Minimum viable product) this may not be necessary.  

* Name
* Images
* Description
* Date Created
* Date Last Accessed(?)

### Images
A singular image with all the meta data needed.
These will probably be stored via CDN with a link pointing to the CDN
rather than storing them on the server itself. May be unnecessary to have
as a separate schema if I can just store them in the galleries gallery.

* filename
* file size
  * limit file size(need to think of a max size)
* filetype
  * limit file types?
* date
* author  
* tags(important)
