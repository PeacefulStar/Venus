import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req);
    res.json({message: 'SSL'});
});

router.get('/', (req, res, next) => {
    console.log(req);
    console.log(next);
    res.json({message: 'Hello SSL'});
});

router.post('/9AR1ZlQNcKIbmMlo8d4pPUva8783K9gP07JJTI-i7Og', (req, res) => {
    res.send(
        '9AR1ZlQNcKIbmMlo8d4pPUva8783K9gP07JJTI-i7Og.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/9AR1ZlQNcKIbmMlo8d4pPUva8783K9gP07JJTI-i7Og', (req, res) => {
    res.send(
        '9AR1ZlQNcKIbmMlo8d4pPUva8783K9gP07JJTI-i7Og.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/JJjqkYtos-w0ZEeJnO6JqD5phrJ3rOjLPFy_lbEJmKw', (req, res) => {
    res.send(
        'JJjqkYtos-w0ZEeJnO6JqD5phrJ3rOjLPFy_lbEJmKw.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/JJjqkYtos-w0ZEeJnO6JqD5phrJ3rOjLPFy_lbEJmKw', (req, res) => {
    res.send(
        'JJjqkYtos-w0ZEeJnO6JqD5phrJ3rOjLPFy_lbEJmKw.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/Rdn4NE2sPu9WYKpgFyh1JZ7uezcCo8zCqD6MT3Vx8dc', (req, res) => {
    res.send(
        'Rdn4NE2sPu9WYKpgFyh1JZ7uezcCo8zCqD6MT3Vx8dc.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/mKrtta-xkyctUuFuIkqsh61PV60Fnp1Nfd0g2jWTG7k', (req, res) => {
    res.send(
        'mKrtta-xkyctUuFuIkqsh61PV60Fnp1Nfd0g2jWTG7k.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg', (req, res) => {
    res.send(
        'yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.get('/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg', (req, res) => {
    res.send(
        'yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI',
    );
});

router.post('/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI', (req, res) => {
    res.send(
        'eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ',
    );
});

router.get('/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI', (req, res) => {
    res.send(
        'eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ',
    );
});

module.exports = router;
