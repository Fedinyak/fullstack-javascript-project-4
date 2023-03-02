import path from 'path';
import nock from 'nock';
// import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import * as fs from 'fs';
import { readFile, mkdtemp } from 'fs/promises';
import copySite from '../src/index';
import os from 'os';

console.log(os.tmpdir());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const getResultPath = (filename) => path.join(__dirname, '..', 'dir1', 'dir2', filename);
beforeAll(() => {
  nock.disableNetConnect();
});

let outputPath;

beforeEach(async () => {
  outputPath = await mkdtemp(path.join(os.tmpdir(), 'tempDir-'));
});

test('copySite fn copy site', async () => {
  console.log(outputPath, 'outputPath temp')

  const result = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  nock('https://ru.hexlet.io') // это регулярное выражение чтобы не указывать полный адрес
    // get – для GET-запросов, post – для POST-запросов и так далее
    .get('/courses')
    .reply(200, result);
  // const copyFile = await readFile(getFixturePath('ru-hexlet-io-courses.html', 'utf-8'));
  // const copyFile = await copySite(outputPath, url);
  // response.data
  // 'dir1/dir2' https://ru.hexlet.io/courses
  const url = 'https://ru.hexlet.io/courses';
  // const outputPath = path.join(); 
  // const outputPath = 'dir1/dir2';
  const tempPath = path.join(__dirname, outputPath, 'ru-hexlet-io-courses.html');
  // await copySite('tempPath', url);
  await copySite(tempPath, url);
  console.log(tempPath, 'tempPathhhhhh')
  const copyFile = await readFile(path.join(tempPath, 'ru-hexlet-io-courses.html'), 'utf-8');
  // const copyFile = await readFile('/tempPath', 'utf-8');
  // const outputPath ='dir1/'; 
  // console.log(outputPath, url, 'outputPath, url' )

  // console.log(result)
  expect(copyFile).toStrictEqual(result);
  // expect(result).toStrictEqual(result);
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
