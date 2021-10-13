const fs = require('fs');
const path = require('path');

const scriptArs = process.argv.slice(2)
const entry = scriptArs[0] || 'input'
const output = scriptArs[1] || 'output'
const remove = scriptArs[2] || false

const entryPath = path.join(__dirname, entry)
const outputPath = path.join(__dirname, output)


const errorHandler = (err) => {
  if (err) console.log(err)
}

const makeDirect = (filePath) => {
  if (!fs.existsSync(filePath)) fs.mkdirSync(filePath)
}

const copyFile = (file) => {
  const firstLetter = file.name[0].toUpperCase()
  // not right
  const newPath = path.join(outputPath, firstLetter)

  makeDirect(newPath)

  fs.copyFile(
    file.path,
    path.join(newPath, file.name),
    err => errorHandler(err)
  )
}

const reader = (filePath) => {
  fs.readdir(filePath, (err, data) => {
    errorHandler(err)
    data.forEach((file) => {
      const basePath = path.join(filePath, file)
      const stat = fs.statSync(basePath)
      if (stat.isFile()) {
        copyFile({
          name: file,
          path: basePath
        });
      } else {
        reader(basePath)
      }
    })
  })
}

const deleter = (filePath) => {
  fs.readdir(filePath, (err, data) => {
      errorHandler(err)
      data.forEach((file) => {
        const basePath = path.join(filePath, file)
        const stat = fs.statSync(basePath)
        if (stat.isFile()) {
          fs.unlinkSync(basePath)
        } else {
          deleter(basePath)
        }
      })
  })
}

const main = (
  makeDirect,
  reader,
  deleter
  ) => {
  makeDirect(),
  reader(),
  deleter()
}

main(
  () => makeDirect(outputPath),
  () => reader(entryPath),
  () => {
    if (remove) deleter(entryPath)
  },
)
