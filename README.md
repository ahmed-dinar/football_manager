
# Football Manager App (Backend)

|            |         |          
|     :---       |    :---    |              
|    Language    |   Javascript (NodeJS)    |         
|    Framework   |   ExpressJS   |            
|    Database    |   MySQL       |
|    Database Name    |   football_manager       |



```
$ npm install
$ node server.js
```

## API Documentation

**Base Url: http://localhost:3000**

##### ``POST /api/signup``
> manager registration

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded'
}

body: {
  email: '',
  name: ''
  password: '', 
  confirmPassword: ''
}
```

```javascript
Success Response: 200
Error Response: 400
```


##### ``POST /api/signin``
> manager login

```javascript
headers: {
  Content-Type: application/x-www-form-urlencoded
}

body: {
  email: '',
  password: ''
}
```

```javascript
Success Response: 200
{
  access_token: '',
  payLoad: {}
}
Error Response: 401
```

##### GET ``/api/team/list``
> get current logged in managers team list

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}
```

```javascript
Success Response: 200
[]
Error Response: 401
```


##### ``POST /api/team/create``
> create a team

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}

body: {
  name: '',
  origin: '',
  net_worth: ''
}
```


```javascript
Success Response: 200
Error Response: 400
```


##### ``GET /api/team/:teamName``
> get a specific team details

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}
```

```javascript
Success Response: 200
{}
Error Response: 400
```

##### ``GET /api/team/:teamName/players``
> get a specific team's player list

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}
```


```javascript
Success Response: 200
[]
Error Response: 400
```



##### ``GET /api/team/:teamName/player/:playerName``
> get a specific team's player details

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}
```


```javascript
Success Response: 200
{}
Error Response: 400
```


##### ``POST /api/team/:teamName/addplayer``
> add a player to a team

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}

body: {
  name: '',
  position: '',
  rating: '',
  salary: ''
}
```


```javascript
Success Response: 200
Error Response: 400
```


##### ``POST /api/team/:teamName/delete/:playerName``
> detele a player from a team

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}
```


```javascript
Success Response: 200
Error Response: 400
```


##### ``POST /api/team/:teamName/update/:playerName``
> update a player info of a team 

```javascript
headers: {
  Content-Type: 'application/x-www-form-urlencoded',
  access_token: ''
}

body: {
  position: '',
  rating: '',
  salary: ''
}
```


```javascript
Success Response: 200
Error Response: 400
```
