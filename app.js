import {
    app,
    uuid,
    query,
    sparqlEscape
} from "mu";

app.post("/clock/update/:id", function(req, res) {
    let id = req.params.id;
    let uuidValue = uuid();
    let now = new Date();
    let value = sparqlEscape(JSON.stringify({
        time: now.toLocaleDateString(undefined, {
            timeZone: "Europe/Brussels",
            dateStyle: 'full',
            timeStyle: 'long',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    }), 'string')
    let type = "http://clock"
    let q = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX mupush: <http://mu.semte.ch/vocabularies/push/>
    INSERT INTO <http://mu.semte.ch/application> {
        <http://semte.baert.jp.net/push-updates/v0.1/${uuidValue}>  mu:uuid ${sparqlEscape(uuidValue, 'string')};
                                                                    a mupush:PushUpdate;
                                                                    mupush:tabId ${sparqlEscape(id, 'string')};
                                                                    mupush:type <${type}>;
                                                                    rdf:value ${value}.
    }
    `
    query(q)
        .then(() => {
            console.log(`Added push update for ${id}`)
        })
        .catch((err) => {
            console.error(err)
        })
    res.status(204).send()
})