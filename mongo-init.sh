set -e

mongo <<EOF
db = db.getSiblingDB('venus')

db.createUser({
  user: 'venus',
  pwd: 'Powbosm2095',
  roles: [{ role: 'readWrite', db: 'venus' }],
});
db.createCollection('users')

EOF
