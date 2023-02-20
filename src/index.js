// import fs from 'fs';
import fs from 'node:fs/promises';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
// const path = require('path');

const copySite = (outputPath, url) => {
  // const normalizeUrl = new URL(url);
  // const fileName = `${normalizeUrl.host}${normalizeUrl.pathname}`;
  const fileName = url.replace('https://', '');
  const pattern = /[^0-9^a-z^A-Z]/;
  const normalizeFileName = `${fileName.replaceAll(new RegExp(pattern, 'g'), '-')}.html`;
  console.log(fileName, 'fileName');
  console.log(normalizeFileName, 'normalizeFileName');
  const dirPath = path.join(outputPath, normalizeFileName);
  // const dirPath = fileName;
  console.log(outputPath, 'dirPath');
  // const content = url;

  // try {
  //   fs.mkdir(outputPath, { recursive: true }, (err) => {
  //     if (err) throw err;
  //   });
  // } catch (err) {
  //   console.error(err.message);
  // }
  // try {
  //   fs.writeFile(dirPath, content, (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //     // file written successfully
  //   });
  // } catch (err) {
  //   console.error(err.message);
  // }

  const makeDir = fs.mkdir(outputPath, { recursive: true });
  // const getContent = fsp.readFile(fs.writeFile(dirPath, content, (err)));
  const promise = Promise.all([makeDir]);
  return promise.then(() => {
    axios.get(url)
      .then((response) => {
        // handle success
        fs.writeFile(dirPath, response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(() => {
        // always executed
      });
  });
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
