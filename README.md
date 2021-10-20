# Youtube Api Exposer
It allows to control Youtube webpage via API remotely.
## How does it work?
![schema](/schema.png)

This script creates a websocket connection to [Controller](https://github.com/albionah/YoutubeController), which needs to run locally. This is a limitation because of [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Or it is possible to forward websocket connection somehow.
The Controller simply makes it possible to access the API from remote computers and use any protocol you want.
## Contribution
The current API is very limited. Therefore, I appreciate any kind of contribution, improvements, suggestion...
