// import fs from 'fs';
import fs from 'node:fs/promises';
import path from 'path';
import axios from 'axios';
import { cwd } from 'node:process';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cheerio from 'cheerio';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from 'prettier';
//        'https://ru.hexlet.io/courses'  'dir1/dir2'
const copySite = (url, outputPath = cwd()) => {
  //                      ru.hexlet.io/courses/
  const urlConstructor = new URL(url);
  const host = urlConstructor.hostname;
  const originUrl = urlConstructor.origin;
  const newHtmlName = url.replace('https://', '');
  const pattern = /[^0-9^a-z^A-Z]/;
  const normalizeFileName = (name, extension = '') => `${name.replaceAll(new RegExp(pattern, 'g'), '-')}${extension}`;
  //                         'dir1/dir2'                ru-hexlet-io-courses-img.html
  const dirHtmlPath = path.join(outputPath, normalizeFileName(newHtmlName, '.html'));
  const dirNamePath = normalizeFileName(newHtmlName, '_files');
  const dirPath = path.join(outputPath, dirNamePath);

  let $html;
  return (
    axios
      .get(url, { responseType: 'arraybuffer' })
      .then((response) => {
        $html = cheerio.load(response.data);
      })
      .then(() => fs.access(dirPath).catch(() => fs.mkdir(dirPath, { recursive: true })))
      .then(() => {
        $html('img').each((i, e) => {
          //                "/assets/professions/nodejs.png"
          const originAttr = $html(e).attr('src');
          const newAttr = originAttr.replaceAll('/', '-');
          const normalizeHost = normalizeFileName(host);
          // const selector = `${tag}[${attr}="${originAttr}"]`;
          // $(selector).attr(attr, newSrc);
          // '[data-selected=true]'
          // const selector = '[src="sdfasdfsadfassets/professions/nodejs.png"]';
          // $html(`[src="${originAttr}"]`).replaceWith(normalizeFileName(originAttr));
          // src="ru-hexlet-io-courses_files/ru-hexlet-io-assets-professions-nodejs.png"
          // src="ru-hexlet-io-courses_files/assets/professions/nodejs.png"
          const newFileName = path.join(dirNamePath, `${normalizeHost}${newAttr}`);
          $html(`[src="${originAttr}"]`).attr('src', newFileName);
          // const data = img.replace(/^data:image\/\w+;base64,/, '');
          // const buf = Buffer.from(data, 'base64');
          // fs.writeFile('image.png', buf /* callback will go here */);
          console.log(path.join(originUrl, originAttr));
          // console.log(originUrl);
          axios
            .get(path.join(originUrl, originAttr), { responseType: 'arraybuffer' })
            .then((response) => {
              const downloadImg = Buffer.from(response.data, 'binary');
              return fs.writeFile(path.join(dirPath, `${normalizeHost}${newAttr}`), downloadImg);
            })
            .catch((error) => {
              // handle error
              console.log(error);
            });
          // $html(`${originAttr}`).replaceWith('newFileName', 'fdasf');
          // return $html(e);
        });
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
        // handle error
        console.log(error);
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
