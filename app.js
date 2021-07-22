import {
    app,
    uuid,
    query,
    sparqlEscape
} from "mu";

// Generate a clock update for a certain tab
app.post("/clock/update/:id", function(req, res) {
    // The receiving tab
    let id = req.params.id;
    let uuidValue = uuid();
    let now = new Date();
    let value = sparqlEscape(JSON.stringify({
        time: now.toLocaleDateString(undefined, {
            timeZone: "Europe/Brussels",
            dateStyle: 'full',
            timeStyle: 'long',
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    }), 'string')
    let dateISOString = now.toISOString()
    // Set the type and realm
    let type = "http://update"
    let realm = "http://clock"
    // Insert the data
    let q = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX mupush: <http://mu.semte.ch/vocabularies/push/>
    PREFIX dc:  <http://purl.org/dc/terms/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {
        GRAPH<http://mu.semte.ch/application> {
            <http://semte.baert.jp.net/push-updates/v0.1/${uuidValue}>  a mupush:PushUpdate;
                                                                        mu:uuid ${sparqlEscape(uuidValue, 'string')};
                                                                        mupush:tabId ${sparqlEscape(id, 'string')};
                                                                        mupush:realm <${realm}>;
                                                                        mupush:type <${type}>;
                                                                        rdf:value ${value};
                                                                        dc:created ${sparqlEscape(dateISOString, 'string')}^^xsd:dateTime.
        }
    }
    `
    // dc:created "time string in iso formaat"^^xsd:dateTime
    query(q)
        .then(() => {
            console.log(`Added push update for ${id}`)
        })
        .catch((err) => {
            console.error(err)
        })
    res.status(204).send()
})
