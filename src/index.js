// import fs from 'fs';
import fs from 'node:fs/promises';
import path from 'path';
import axios from 'axios';
import { cwd } from 'node:process';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cheerio from 'cheerio';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from 'prettier';
// eslint-disable-next-line import/no-extraneous-dependencies
import debug from 'debug';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'axios-debug-log';

const log = debug('page-loader');

const pattern = /[^0-9^a-z^A-Z]/;
const normalizeFileName = (name, extension = '') => `${name.replaceAll(new RegExp(pattern, 'g'), '-')}${extension}`;

const copySite = (url, outputPath = cwd()) => {
  const urlConstructor = new URL(url);
  log('Site address %s', url);
  log('Download path %s', outputPath);
  const host = urlConstructor.hostname;
  const originUrl = urlConstructor.origin;
  const newHtmlName = url.replace(`${urlConstructor.protocol}//`, '');
  const normalizeHost = normalizeFileName(host);
  const dirHtmlPath = path.join(outputPath, normalizeFileName(newHtmlName, '.html'));
  const dirNamePath = normalizeFileName(newHtmlName, '_files');
  const dirPath = path.join(outputPath, dirNamePath);
  const tags = { img: 'src', link: 'href', script: 'src' };
  const tagsKeys = Object.keys(tags);

  let $html;
  // <link href="/assets/application.css" />
  // <link href="ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css" />
  // const assetsAttr = {};

  // '[href="/assets/application.css"]':
  //   '[href="ru-hexlet-io-courses_files/ru-hexlet-io-assets-application.css"]',
  // href='/assets/application.css'
  // tags[key]="${originAttr
  // const assetsDownload = [];
  return (
    axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        $html = cheerio.load(response.data);
      })
      .then(() => fs.access(dirPath).catch(() => fs.mkdir(dirPath, { recursive: true })))
      // .then(() => {
      //   tagsKeys.map((key) => $html(key).each((i, selector) => {
      //     const originAttr = $html(selector).attr(tags[key]);
      //     let newAttr;
      //     let downloadFilePath;
      //     if (originAttr.includes('http')) {
      //       const newAttrUrl = new URL(originAttr);
      //       if (newAttrUrl.hostname !== host) {
      //         return;
      //       }
      //       downloadFilePath = path.join(originAttr);
      //     } else {
      //       downloadFilePath = path.join(originUrl, originAttr);
      //     }
      //     if (!newAttr.includes('.')) {
      //       newAttr = `${newAttr}.html`;
      //     }
      //     const normalizeHost = normalizeFileName(host);
      //     const newFilePath = path.join(dirNamePath, `${normalizeHost}${newAttr}`);
      //     $html(`[${tags[key]}="${originAttr}"]`).attr(tags[key], newFilePath);
      //   }));
      // })
      .then(() => {
        // src="https://ru.hexlet.io/packs/js/runtime.js"
        tagsKeys.map((key) => $html(key).each((i, selector) => {
          const originAttr = $html(selector).attr(tags[key]);
          if (!originAttr) {
            return;
          }
          let newAttr;
          let downloadFilePath;
          if (originAttr.includes('http')) {
            const newAttrUrl = new URL(originAttr);
            if (newAttrUrl.hostname !== host) {
              // newAttr = originAttr;
              return;
              // return newAttr;
              // console.log(newAttrUrl.hostname, host, 'newAttrUrl.hostname !== host');
            }
            newAttr = newAttrUrl.pathname.replaceAll('/', '-');
            downloadFilePath = path.join(originAttr);
          } else {
            newAttr = originAttr.replaceAll('/', '-');
            downloadFilePath = path.join(originUrl, originAttr);
          }
          if (!newAttr.includes('.')) {
            newAttr = `${newAttr}.html`;
          }
          // console.log(originAttr, 'originAttr');
          const newFilePath = path.join(dirNamePath, `${normalizeHost}${newAttr}`);
          // assetsAttr[`[${tags[key]}="${originAttr}"]`] = `[${tags[key]}="${newFilePath}"]`;
          $html(`[${tags[key]}="${originAttr}"]`).attr(tags[key], newFilePath);
          // assetsDownload.push(downloadFilePath, 'downloadFilePath');
          // console.log(downloadFilePath, 'paaaaaath to download');
          // console.log(path.join(originUrl, originAttr));

          axios
          // .get(path.join(originUrl, originAttr), { responseType: 'arraybuffer' })
            .get(downloadFilePath, { responseType: 'arraybuffer' })
            .then((response) => {
              const downloadData = Buffer.from(response.data, 'binary');
              log('Download file %s', newAttr);
              return fs.writeFile(path.join(dirPath, `${normalizeHost}${newAttr}`), downloadData);
            })
            .catch((error) => {
              console.error(error.data);
              throw new Error(error.message);
            });
          // return $html(e);
          // console.log(downloadFilePath, 'downloadFilePath');
        }));
      })
      // eslint-disable-next-line arrow-body-style
      .then(() => {
        // handle success
        // console.log($html);
        return fs.writeFile(dirHtmlPath, prettier.format($html.html(), { parser: 'html' }));
        // console.log(response.data);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
      })
      .catch((error) => {
        // if (error.response) {
        //   // The request was made and the server responded with a status code
        //   // that falls out of the range of 2xx
        //   console.error(error.response.data, '-----------------------error.response.data');
        //   console.error(error.response.status, '-----------------------error.response.status');
        //   console.error(error.response.headers, '-----------------------error.response.headers');
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //   // http.ClientRequest in node.js
        //   console.error(error.request, '-----------------------error.request');
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   console.error('Error', error.message, '-----------------------error.message');
        // }
        // console.error(error.config, '-----------------------config');
        // console.error(error.toJSON(), ' console.log(error.toJSON());');
        // handle error
        // errno: -3008,
        // code: 'ENOTFOUND',
        // syscall: 'getaddrinfo',
        // hostname: 'ru.hexl'
        // console.error(error.response.data);
        // console.error(error.response.status);
        // console.error(error.response.headers);
        // log(error.message);
        console.error(error.message);
        throw new Error(error.message);
        // throw new Error(`${error.config}error.configggggggggg`);
        // console.error(error.message);
      })
  );
  // .finally(() => {
  //   // always executed
  // });
  // --------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------
  // const makeDir = fs.mkdir(outputPath, { recursive: true });
  // // const getContent = fsp.readFile(fs.writeFile(dirPath, content, (err)));
  // console.log(outputPath, 'outputPathhhhhhh')
  // const promise = Promise.all([makeDir]);
  // // fs.writeFile('outputPath1.txt', 'response');
  // return promise.then(() => {
  //   // console.log(url, 'axioooos url')
  //   // console.log(dirPath, 'dirPathhhhhh1');
  //   // console.log(cwd(), 'dirPathhhhhhh cwd');
  //   axios.get(url, { responseType: 'arraybuffer' })
  //     // console.log(response);
  //     .then((response) => {
  //       fs.writeFile('outputPath3.txt', 'response');
  //       // handle success
  //       // console.log(dirPath, 'dirPathhhhhh2');
  //       return fs.writeFile(dirPath, response.data);
  //       // console.log(response.data);
  //       // console.log(response.statusText);
  //       // console.log(response.headers);
  //       // console.log(response.config);
  //     })
  //     .catch((error) => {
  //       // handle error
  //       console.log(error)
  //     });
  //   // .finally(() => {
  //   //   // always executed
  //   // });
  // });
  // --------------------------------------------------------------------------------------
};
// try {
//   const projectFolder = new URL('./test/project/', import.meta.url);
//   const createDir = await mkdir(projectFolder, { recursive: true });

//   // console.log(`created ${createDir}`);
// }
// fsp.readFile('./first', 'utf-8')
//   .then((data1) => console.log(data1))
//   .then(() => fsp.readFile('./second', 'utf-8'))
//   .then((data2) => console.log(data2))
//   .then(() => fsp.readFile('./third', 'utf-8'))
//   .then((data3) => console.log(data3));

export default copySite;
