const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const moment = require('moment');

var admin = require("firebase-admin");

admin.initializeApp();
var db = admin.firestore();

exports.scheduledFunctionCrontab = functions.pubsub.schedule('5 7 * * 1')
  .timeZone('Europe/Helsinki')
  .onRun((context) => {

    return (async () => {
    	const browser = await puppeteer.launch({headerless: true, args: ['--no-sandbox']});
    	const page = await browser.newPage();
    	await page.goto("https://www.ravintolawerstas.fi/lounaslista/")

    	const result = await page.evaluate(() => {
    		let menuContent = document.querySelectorAll(".dish-list_group")
    		let menuCols = [...menuContent]
    		let menu = menuCols.map(m => {
    			let foodC = m.querySelectorAll(".stm_dish")
    			let c = [...foodC]
    			let foodData = c.map( m => {
    				let food = m.querySelector(".stm_dish_name").textContent;
    				let price = m.querySelector(".stm_dish_cost").textContent;
    				let content = m.querySelector(".stm_dish-content").textContent
    				return { food, price, content };
    			})
    			return foodData
    		})
    		return menu
    	});

    	const year = moment().format("gggg")
    	const week = moment().format("ww")

    	const json = {
    		year: year,
    		week: week,
    		menu: {...result}
    	 }

       console.log(json)

    	await db.collection('werstasmenu').doc()
    		.create(json)

    	return await browser.close()
    })()
});
