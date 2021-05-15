# Youtube Api Exposer
It allows to control Youtube webpage via API remotely.
## How does it work?
![schema](/schema.png)

This script creates a websocket connection to Controller (I publish Controller later), which needs to run locally. This is a limitation because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). The Controller simply makes it possible to access the API from remote computers and use any protocol you want.
## Contribution
The current API is very limited. Therefore I appreciate any kind of contribution, improvements, suggestion...
