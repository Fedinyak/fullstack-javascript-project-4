// import fs from 'fs';
import fs from 'node:fs/promises';
import path from 'path';
import axios from 'axios';
import { cwd } from 'node:process';
// const path = require('path');

const copySite = (outputPath = cwd(), url) => {
  console.log(outputPath, 'dirPath');
  // const normalizeUrl = new URL(url);
  // const fileName = `${normalizeUrl.host}${normalizeUrl.pathname}`;
  const fileName = url.replace('https://', '');
  const pattern = /[^0-9^a-z^A-Z]/;
  const normalizeFileName = `${fileName.replaceAll(new RegExp(pattern, 'g'), '-')}.html`;
  // console.log(fileName, 'fileName');
  // console.log(normalizeFileName, 'normalizeFileName');
  const dirPath = path.join(outputPath, normalizeFileName);
  // const dirPath = fileName;
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
  // ----------------------------------------------------------------------------------------------
  // const getContent = fsp.readFile(fs.writeFile(dirPath, content, (err)));
  // fs.writeFile('outputPath1.txt', 'response');
  // console.log(url, 'axioooos url')
  // console.log(dirPath, 'dirPathhhhhh1');
  // console.log(cwd(), 'dirPathhhhhhh cwd');
  let data;
  return axios.get(url, { responseType: 'arraybuffer' })
    .then((response) => {
      data = response.data
    })
    // console.log(response);
    .then(() => fs.access(outputPath).catch(() => {
      return fs.mkdir(outputPath, { recursive: true });
    }))
    .then(() => {
      // handle success
      // fs.writeFile('outputPath7.txt', 'response');
      // console.log(dirPath, 'dirPathhhhhh2');
      // return fs.writeFile(dirPath, response.data);
      console.log('3 TRY')
      return fs.writeFile(dirPath, data);
      // console.log(response.data);
      // console.log(response.statusText);
      // console.log(response.headers);
      // console.log(response.config);
    })
    .catch((error) => {
      // handle error
      console.log(error)
    });
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
