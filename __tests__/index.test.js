import path from 'path';
import nock from 'nock';
// import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import * as fs from 'fs';
import {
  readFile, mkdtemp, chmod, stat,
} from 'fs/promises';
// import { readFile, mkdtemp, stat } from 'fs/promises';
import os from 'os';
import copySite from '../src/index';

// console.log(os.tmpdir());
const host = 'https://ru.hexlet.io';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = 'https://ru.hexlet.io/courses';
let tempDirPath;
let initialHtml;
let image;
let styles;
let script;
let resultHtml;

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
// const getinitialHtmlPath = (filename) => path.join(__dirname, '..', 'dir1', 'dir2', filename);
beforeAll(() => {
  nock.disableNetConnect();
});
// nock.disableNetConnect();

beforeEach(async () => {
  // beforeAll(async () => {
  tempDirPath = await mkdtemp(path.join(os.tmpdir(), 'tempDir-'));
  initialHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  image = await readFile(getFixturePath('node.png'));
  styles = await readFile(getFixturePath('styles.css'), 'utf-8');
  script = await readFile(getFixturePath('script.js'), 'utf-8');
  resultHtml = await readFile(getFixturePath('ru-hexlet-io-courses-img.html'), 'utf-8');
});

describe('Positive case', () => {
  test('Download html and assets', async () => {
    // console.log(tempDirPath, 'tempDirPath temp');

    nock(host) // это регулярное выражение чтобы не указывать полный адрес
      // get – для GET-запросов, post – для POST-запросов и так далее
      .get('/courses')
      .reply(200, initialHtml)
      .get('/assets/professions/nodejs.png')
      .reply(200, image)
      .get('/assets/application.css')
      .reply(200, styles)
      .get('/packs/js/runtime.js')
      .reply(200, script)
      .get('/courses')
      .reply(200, initialHtml);
    // https://ru.hexlet.io/courses"
    // const expectedHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html', 'utf-8'));
    // const expectedHtml = await copySite(tempDirPath, url);
    // response.data
    // 'dir1/dir2' https://ru.hexlet.io/courses
    // const url = 'https://ru.hexlet.io/courses';
    // const tempDirPath = path.join();
    // const tempDirPath = 'dir1/dir2';
    // const tempPath = path.join(__dirname, tempDirPath, 'ru-hexlet-io-courses.html');
    // const tempPath = path.join(tempDirPath);
    // const tempPath = path.join(tempDirPath, 'ru-hexlet-io-courses.html');
    // await copySite('tempPath', url);
    await copySite(url, tempDirPath);
    // console.log(tempDirPath, 'tempPathhhhhh');
    const expectedHtml = await readFile(
      path.join(tempDirPath, 'ru-hexlet-io-courses.html'),
      'utf-8',
    );
    // ------------------------------------------------------ DELETE COMMENT

    // ------------------------------------------------------ DELETE COMMENT
    const expectedStyles = await readFile(
      path.join(tempDirPath, 'ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css'),
      'utf-8',
    );
    // const expectedImg = await readFile(
    //   path.join(
    //     tempDirPath,
    //     'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png',
    //   ),
    // );
    const expectedImg = await stat(
      path.join(
        tempDirPath,
        'ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png',
      ),
    );
    // const expectedHtml = await readFile(tempPath, 'utf-8');
    // const tempDirPath = 'dir1/';
    // console.log(tempDirPath, url, 'tempDirPath, url' )

    // console.log(initialHtml)
    expect(expectedHtml).toStrictEqual(resultHtml);
    expect(expectedStyles).toStrictEqual(styles);
    // expect(expectedImg).toStrictEqual(image);
    expect(expectedImg.isFile()).toBeTruthy();
    // ------------------------------------------------------ DELETE COMMENT
    // expect(initialHtml).toStrictEqual(initialHtml);
  });
  afterAll(() => {
    nock.cleanAll();
  });
});

describe('Negative file system case', () => {
  test('folder not exist', async () => {
    initialHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    image = await readFile(getFixturePath('node.png'));
    styles = await readFile(getFixturePath('styles.css'), 'utf-8');
    script = await readFile(getFixturePath('script.js'), 'utf-8');
    nock(host) // это регулярное выражение чтобы не указывать полный адрес
      .get('/courses')
      .reply(200, initialHtml)
      .get('/assets/professions/nodejs.png')
      .reply(200, image)
      .get('/assets/application.css')
      .reply(200, styles)
      .get('/packs/js/runtime.js')
      .reply(200, script)
      .get('/courses')
      .reply(200, initialHtml);
    // const url = 'https://ru.hexlet.io/courses';

    expect(copySite(url, '/not-exist-dir')).rejects.toThrowError('ENOENT');
  });

  test('permissions denied', async () => {
    initialHtml = await readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    image = await readFile(getFixturePath('node.png'));
    styles = await readFile(getFixturePath('styles.css'), 'utf-8');
    script = await readFile(getFixturePath('script.js'), 'utf-8');
    nock(host) // это регулярное выражение чтобы не указывать полный адрес
      .get('/courses')
      .reply(200, initialHtml)
      .get('/assets/professions/nodejs.png')
      .reply(200, image)
      .get('/assets/application.css')
      .reply(200, styles)
      .get('/packs/js/runtime.js')
      .reply(200, script)
      .get('/courses')
      .reply(200, initialHtml);
    // const url = 'https://ru.hexlet.io/courses';
    // const permissionDeniedPath = tempDirPath.join(tempDirPath, 'folder-denied');
    await chmod(tempDirPath, 0o400);
    expect(copySite(url, tempDirPath)).rejects.toThrowError('EACCES');
  });

  afterAll(() => {
    nock.cleanAll();
  });
});

describe('Negative network case', () => {
  test('404 case', async () => {
    nock(host) // это регулярное выражение чтобы не указывать полный адрес
      .get('/courses')
      .reply(404);
    // const url = 'https://ru.hexlet.io/courses';

    await expect(copySite(url, tempDirPath)).rejects.toThrowError('404');
  });
  test('500 case', async () => {
    nock(host) // это регулярное выражение чтобы не указывать полный адрес
      .get('/courses')
      .reply(500);
    // const url = 'https://ru.hexlet.io/courses';

    await expect(copySite(url, tempDirPath)).rejects.toThrowError('500');
  });
  afterAll(() => {
    nock.cleanAll();
  });
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
