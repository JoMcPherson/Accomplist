# API Design

##      Access below endpoints through FastAPI Swagger
Screenshot Below
![Img](./images/FastAPISwagger.png)


###         Accounts
| Action | Method | URL
| ----------- | ----------- | ----------- |
| Get Token	| GET |	http://localhost:8000/token
| Login | POST	| http://localhost:8000/token
|Logout	| DELETE	| http://localhost:8000/token
|Get All Accounts |	GET	| http://localhost:8000/api/accounts
|Create Account	| POST	| http://localhost:8000/api/accounts
|Get User By Id	| GET |	http://localhost:8000/api/accounts/{account_id}
|Delete User| DELETE | http://localhost:8000/api/accounts/{account_id}
|Patch Account Bio	| PATCH	|http://localhost:8000/api/accounts/{account_id}
|Update Account| PUT	|http://localhost:8000/api/accounts/{user_id}
|Get Acc By Username| GET |http://localhost:8000/tokeneer/{username}

###         Accomplist Items
| Action | Method | URL
| ----------- | ----------- | ----------- |
|List Or Search Accomplist Items|	GET|	http://localhost:8000/api/accomplist_items
|Create Accomplist Item | POST|	http://localhost:8000/api/accomplist_items
|Get Accomplist Item	| GET	|http://localhost:8000/api/accomplist_items/{accomplist_item_id}
|Update Accomplist Item	| PUT	|http://localhost:8000/api/accomplist_items/{accomplist_item_id}
|Delete Accomplist Item	| DELETE|	http://localhost:8000/api/accomplist_items/{accomplist_item_id}

###        My Accomplist Items
| Action | Method | URL
| ----------- | ----------- | ----------- |
|Get My Accomplist Items Completed |	GET|	http://localhost:8000/api/accomplist_items/{accomplist_item_id}/{completed}
|Create My Accomplist Item	| POST |	http://localhost:8000/api/my_accomplist_items
|Get Items For Account|	GET	| http://localhost:8000/api/my_accomplist_items/account/{user_id}
|Get My Accomplist Item	|GET	|http://localhost:8000/api/my_accomplist_items/{my_accomplist_item_id}
|Update My Accomplist Item	| PUT |	http://localhost:8000/api/my_accomplist_items/{my_accomplist_item_id}
|Delete My Accomplist Item	| DELETE	|http://localhost:8000/api/my_accomplist_items/{my_accomplist_item_id}

###         Events
| Action | Method | URL
| ----------- | ----------- | ----------- |
|Get All	|GET	| http://localhost:8000/events
|Create Event|	POST	| http://localhost:8000/events
|Get One Event|	GET| http://localhost:8000/events/{event_id}
|Update Event	| PUT	|http://localhost:8000/events/{event_id}
|Delete Event	| DELETE	| http://localhost:8000/events/{event_id}
|Get Account Events	| GET |	http://localhost:8000/events/account/{account_id}



JSON body to send data:
#### Create an account
```
{
  "username": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "date_created": "2023-09-10",
  "bio": "string",
  "photo": "string",
  "password": "string"
}
```
The response body of creating an account

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYjllNjY1Ny02MjdhLTQ2MjYtOWQ1Ni1hNjMxNjI5YjQ3N2MiLCJleHAiOjE2OTQ0MTkzNDksInN1YiI6InN0cmluZyIsImFjY291bnQiOnsidXNlcm5hbWUiOiJzdHJpbmciLCJmaXJzdF9uYW1lIjoic3RyaW5nIiwibGFzdF9uYW1lIjoic3RyaW5nIiwiZW1haWwiOiJzdHJpbmciLCJkYXRlX2NyZWF0ZWQiOiIyMDIzLTA5LTEwVDAwOjAwOjAwKzAwOjAwIiwiYmlvIjoic3RyaW5nIiwicGhvdG8iOiJzdHJpbmciLCJpZCI6MSwiaGFzaGVkX3Bhc3N3b3JkIjoiJDJiJDEyJHcwNVpUSm5ralZvZ1JSYzY3Ni5lWi5WejZTRUtvRDZ0bGFWT2xKRkt0UW41OVV6S1R0cXRpIn19.mQPW-pUMiwpi8tJ8qZCB1ECm3p8G4d6APxkW8im1UIc",
  "token_type": "Bearer",
  "account": {
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "date_created": "2023-09-10",
    "bio": "string",
    "photo": "string",
    "id": 1
  }
}
```

#### Create accomplist item
```
{
    user_id": 1,
    "title": "Skydiving",
    "details": "Someone exiting an aircraft with a parachute intending on reaching surface",
    "photo": "https://cdn-imgix.headout.com/tour/26024/TOUR-IMAGE/0d87db51-0b49-4a89-a7cf-bee3958d6e1e-000ft-tandem-skydive-07.jpg",
    "resources": "https://www.uspa.org/",
    "comments": "listen to instructor",
    "date_added": "2023-08-14"
}
```
The response body for creating an accomplist item
```
{
  "id": 1,
  "user_id": 1,
  "title": "Skydiving",
  "details": "Someone exiting an aircraft with a parachute intending on reaching surface",
  "photo": "https://cdn-imgix.headout.com/tour/26024/TOUR-IMAGE/0d87db51-0b49-4a89-a7cf-bee3958d6e1e-000ft-tandem-skydive-07.jpg",
  "resources": "https://www.uspa.org/",
  "comments": "listen to instructor",
  "date_added": "2023-08-14"
}
```
#### Create my accomplist item
```
{
  "item_id": 1,
  "user_id": 1,
  "completed": false
}
```
The response body for creating my accomplist item
```
{
  "id": 1,
  "item_id": 1,
  "user_id": 1,
  "completed": false,
  "item_title": "Skydiving",
  "username": "string"
}
```
#### Create an event
```
{
  "name": "string",
  "date": "2022-09-10",
  "time": "string",
  "cost": "string",
  "location": "string",
  "description": "string",
  "organizer_id": 1,
  "organizer_username": "string",
  "goal_id": 1
}
```
The response body for creating an event
```
{
  "event_id": 1,
  "name": "string",
  "date": "2022-09-10",
  "time": "string",
  "cost": "string",
  "location": "string",
  "description": "string",
  "organizer_id": 1,
  "organizer_username": "string",
  "goal_id": 1
}
```
