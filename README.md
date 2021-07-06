# Clock

The used prefixes are:
```
PREFIX mupush: <http://mu.semte.ch/vocabularies/push/>
```

This is a backend for generating push updates with mupush:type being `http://clock` .
The API consists of one endpoint:
- POST /clock/update/:id
    - this will generate a push update with mupush:tabId being the id
