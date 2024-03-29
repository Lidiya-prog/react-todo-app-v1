import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';
// const puppeteer = require('puppeteer');
// const lighthouse = require('lighthouse');
// const { URL } = require('url');

async function runTest() {
	const browser = await puppeteer.launch({
		headless: true,
		logLevel: 'silent',
	});
	const page = await browser.newPage({ target: 'page' });

	try {
		// Замените на URL вашего приложения
		const targetUrl = 'http://localhost:3000/';
		await page.goto(targetUrl);

		const lighthouseResult = await runLighthouse(page, browser);

		console.log('Lighthouse Report:', lighthouseResult);

		// await page.waitForSelector('.delete-icon');

		// await page.waitForFunction(
		// 	() => document.querySelector('.delete-icon') !== null
		// );

		await page.waitForFunction(() => window.dataLoaded === true);

		// Проходим по каждой кнопке и замеряем время
		const buttons = await page.$$('.complete-icon'); // Замените на селектор ваших кнопок

		console.log(buttons);
		await page.evaluate(async (test) => {
			console.log('Tasks:', test);
		}, buttons);

		const res = [];
		const result = [];

		for (let i = 0; i < buttons.length; i++) {
			const button = buttons[i];
			// const startTime = Date.now();

			// Нажимаем на кнопку
			await button.click();

			// Замеряем время, прошедшее с момента клика до полной отрисовки
			const renderTime = await measureRenderTime(page);

			await page.evaluate(async (btn) => {
				console.log(3, btn);
			}, renderTime);

			// console.log(`Button ${i + 1} Render Time: ${renderTime} ms`);

			res.push([i + 1, renderTime]);
			result.push(renderTime);

			// const endTime = Date.now();

			// console.log(`Button ${i + 1} Total Time: ${endTime - startTime} ms`);
		}

		console.log(res.slice(0, 100));
		console.log(res.slice(100));
		console.log(result.slice(0, 100));
		console.log(result.slice(100));
	} catch (error) {
		console.error('Test failed:', error);
	}
}

async function runLighthouse(page, browser) {
	const lighthouseConfig = {
		extends: 'lighthouse:default',
		settings: {
			onlyCategories: ['performance'],
		},
	};

	const options = {
		port: new URL(browser.wsEndpoint()).port,
		output: 'json',
	};

	const lighthouseResult = await lighthouse(
		page.url(),
		options,
		lighthouseConfig
	);
	return lighthouseResult.lhr;
}

async function measureRenderTime(page) {
	return page.evaluate(() => {
		const renderStart = performance.now();

		// Ждем события, которое говорит о том, что отрисовка завершена
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				const renderEnd = performance.now();
				resolve(renderEnd - renderStart);
			});
		});
	});
}

runTest();
