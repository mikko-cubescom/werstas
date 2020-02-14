const moment = require('moment');

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://werstas-9a80e.firebaseio.com"
});
var db = admin.firestore();

const year = moment().format("gggg")
const week = moment().format("ww")
const weekday = moment().format("e")-1

console.log(year,week,weekday)

db.collection('werstasmenu')
	.where('week' ,'==', week)
	.where('year' ,'==', year)
	.select('menu')
  .limit(1)
	.get()
	.then((res) => {
		const menu = res.docs[0].get('menu')[weekday];
		console.log(menu)
	});
