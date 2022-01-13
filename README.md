# 🐣 Twitter Clone - A Web Engineering Project

This repo is intended to be the home for the backend API of the final project for the web engineering course (CC552). Where we, the developers of the project, can illustrate the foundation of this API to provide a seamless integration experience with the client's application. Also, to document our work in a slightly professional manner.


# 🥚 Introduction: 
This  `REST API` is built using `Serverless Architecture` with the help of `Firebase` and `ExpressJS`. This means that the entirety of the express application is running through the Firebase cloud service as a Cloud Function. Obviously, this decision was made to simplify the deployment process as much as possible so that the focus remains of the development on the development of the application itself.

# 📟 Tech Stack: 
- `Firebase Authentication` (*_serving as a secure way to both authenticate and authorise users_*)
- `Firebase Firestore` (*_serving as NoSQL datastore of the app_*)
- `Firebase Cloud Functions` (*_serving as the host environment of the backend application_*)
- `Firebase Storage` (*_serving as the file store of the app_*)
- `ExpressJS` (*_serving as the framework used to write the API_*)
- `TypeScript` (*_serving as the scripting langues used to write the API_*)


# 🛠 Usage & EndPoints
To start using this API, an HTTP Request must be made to one of the following endpoints. Make sure to read the notes to insure a issueless integration.

## 🥷 Authorization
Some of the requests below are labeled **'Auth Required'**, these require user authorizing before executing.  
⚠️ **A token must provided in the request header:** ⚠️  
  
  
  'Authorization' : *Token* 


## 📍 `/user` 
This endpoint is responsible for 3 cases:

### 1️⃣. Creating new user.   
⚠️**Auth Required**     

#### HTTP Request Method
- `POST Request`

#### Request Params
- There're no request params for this case.

#### Request Body Object Structure
- The request body shall contain a `JSON Object` structured as follows

```Javascript
{
    email : string       
    username : string      
    birthdate : string   
}
```
    
#### Response Body Object Structure
```Javascript
{  
    id : string   
    email: string   
    name: string   
    username: string   
    avatar : string   
    coverPhoto : string   
    bio : string    
    location : string   
    birthdate : string   
    followers : number   
    following : number   
    tweetsNo : number   
    creationDate : string   
  
 }
 ```

-----
### 2️⃣. Fetching user attributes

 

#### HTTP Request Method
- `GET Request`

#### Request Params. 

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `username`   | String        | The identifier username for user (@username). |

#### Request Body Object Structure. 

- There's no request body for this operation.  

#### Response Body Object Structure
```Javascript
{  
    id : string   
    email: string   
    name: string   
    username: string   
    avatar : string   
    coverPhoto : string   
    bio : string    
    location : string   
    birthdate : string   
    followers : number   
    following : number   
    tweetsNo : number   
    creationDate : string   
  
 }
 ```

-----
### 3️⃣. updating user attributes

⚠️**Auth Required**  

#### HTTP Request Method
- `PATCH Request`

#### Request Params. 
- There're no request params for this case.

#### Request Body Object Structure. 

Each update should be listed in body object
```Javascript
{
    avatar : file       
    name : string      
    birthdate : string   
}
```   

#### Response Body Object Structure
```Javascript
{  
    id : string   
    email: string   
    name: string   
    username: string   
    avatar : string   
    coverPhoto : string   
    bio : string    
    location : string   
    birthdate : string   
    followers : number   
    following : number   
    tweetsNo : number   
    creationDate : string   
  
 }
 ```

-----



## 📍 `/tweets`
This endpoint is responsible for 3 cases:

### 1️⃣. Composing new tweets

#### HTTP Request Method:

- `POST Request`

#### Request Params:

- There're no request params for this case.

#### Request Body Object Structure:
- The request body shall contain a `JSON Object` structured as follows

```Javascript
{
    text: string  // textual content of the tweet
    userId: string // the string identifier of the user
    hasMedia: boolean // if contains Media, set it to true
    mediaType: MediaType // enum representing media type( video, picture, voice)
    hasMention: boolean // if it has mentions, pass as true
    location: string // string descriping location
    timestamp: number // timestamp double number
}
```

- The `mediaType` enum is structured as follows
```Javascript
enum MediaType {
     Video,
     Picture,
     Audio
}
```

----
### 2️⃣. Deleting a tweet
#### HTTP Request Method:
-  `DELETE Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the tweet to delete. |

#### Request Body:
- There's no request body for this operation.

----
### 3️⃣. Loading the feed
#### HTTP Request Method:
- `GET Request`

#### Request Params:
- There're no request params for this case.

#### Request Body:
- There's no request body for this operation.

-----

## 📍 `/tweet`
This endpoint is responsible for loading a single tweet.

#### HTTP Request Method:
-  `GET Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the tweet to load. |

#### Request Body:
- There's no request body for this operation.


## 📍 `/profile`
This endpoint is responsible for loading the tweets of a single user.

#### HTTP Request Method:
-  `GET Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the user to load. |

#### Request Body:
- There's no request body for this operation.

## 📍 `/follow`
This endpoint is responsible for 2 cases:

### 1️⃣. Follow a user
⚠️**Auth Required** 

#### HTTP Request Method:

- `POST Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the user to follow. |


#### Request Body Object Structure:
- No Request body


#### Response Body Object Structure
```Javascript
success or error message
 ```
---
### 2️⃣. unfollow a user
⚠️**Auth Required** 

#### HTTP Request Method:

- `DELETE Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the user to unfollow. |


#### Request Body Object Structure:
- No Request body


#### Response Body Object Structure
```Javascript
success or error message
 ```
---
## 📍 `/follow/followers`
### get user followers
⚠️**Auth Required** 

#### HTTP Request Method:

- `GET Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the user to get followers for. |


#### Request Body Object Structure:
- No Request body


#### Response Body Object Structure
Array of brief user objects
```Javascript
  [
    {
    username,
    name,
    avatar
    },
    ...
  ]

 ```
---

## 📍 `/follow/following`
### get user followings
⚠️**Auth Required** 

#### HTTP Request Method:

- `GET Request`

#### Request Params:

| Param         | Type          | Description  |
| :-------------: |:-----------:|:-----|
| `id`   | String        | The identifier string of the user to get followers for. |


#### Request Body Object Structure:
- No Request body


#### Response Body Object Structure
Array of brief user objects
```Javascript
  [
    {
    username,
    name,
    avatar
    },
    ...
  ]
 ```
---

