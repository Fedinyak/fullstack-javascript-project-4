import path from 'path';
import nock from 'nock';
// import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import * as fs from 'fs';
import { readFile, mkdtemp } from 'fs/promises';
import os from 'os';
import copySite from '../src/index';

// console.log(os.tmpdir());
const host = 'https://ru.hexlet.io';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const getinitialHtmlPath = (filename) => path.join(__dirname, '..', 'dir1', 'dir2', filename);
beforeAll(() => {
  nock.disableNetConnect();
});

let filePath;

beforeEach(async () => {
  filePath = await mkdtemp(path.join(os.tmpdir(), 'tempDir-'));
});

test('copySite fn copy site', async () => {
  // console.log(filePath, 'filePath temp');

  const initialHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  const image = await readFile(getFixturePath('node.png'), 'utf-8');
  const resultHtml = await readFile(getFixturePath('ru-hexlet-io-courses-img.html'), 'utf-8');
  nock(host) // это регулярное выражение чтобы не указывать полный адрес
    // get – для GET-запросов, post – для POST-запросов и так далее
    .get('/courses')
    .reply(200, initialHtml);
  nock(host)
    .get('/assets/professions/nodejs.png')
    .reply(200, image);
  // const downloadHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html', 'utf-8'));
  // const downloadHtml = await copySite(filePath, url);
  // response.data
  // 'dir1/dir2' https://ru.hexlet.io/courses
  const url = 'https://ru.hexlet.io/courses';
  // const filePath = path.join();
  // const filePath = 'dir1/dir2';
  // const tempPath = path.join(__dirname, filePath, 'ru-hexlet-io-courses.html');
  // const tempPath = path.join(filePath);
  // const tempPath = path.join(filePath, 'ru-hexlet-io-courses.html');
  // await copySite('tempPath', url);
  await copySite(url, filePath);
  // console.log(filePath, 'tempPathhhhhh');
  const downloadHtml = await readFile(path.join(filePath, 'ru-hexlet-io-courses.html'), 'utf-8');
  const downloadImg = await readFile(
    path.join(filePath, 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png'),
    'utf-8',
  );
  // const downloadHtml = await readFile(tempPath, 'utf-8');
  // const filePath ='dir1/';
  // console.log(filePath, url, 'filePath, url' )

  // console.log(initialHtml)
  expect(downloadHtml).toStrictEqual(resultHtml);
  expect(downloadImg).toStrictEqual(image);
  // expect(initialHtml).toStrictEqual(initialHtml);
});
afterAll(() => {
  nock.cleanAll();
});

afterAll(() => {
  nock.enableNetConnect();
});
// test('the fetch fails with an error', async () => {
//   await expect(fetchData()).rejects.toMatch('error');
// });
// guard extension
// wrong request
// name
// dir
// file exist
// file equal
// test('the data is peanut butter', async () => {
//   const data = await fetchData();
//   expect(data).toBe('peanut butter');
// });

// test('the fetch fails with an error', async () => {
//   expect.assertions(1);
//   try {
//     await fetchData();
//   } catch (e) {
//     expect(e).toMatch('error');
//   }
// });

// You can combine async and await with .resolves or .rejects.

// test('the data is peanut butter', async () => {
//   await expect(fetchData()).resolves.toBe('peanut butter');
// });

// test('the fetch fails with an error', async () => {
//   await expect(fetchData()).rejects.toMatch('error');
// });
