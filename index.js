const fs = require('fs');
const path = require('path');

const scriptArs = process.argv.slice(2)
const entry = scriptArs[0] || 'input'
const output = scriptArs[1] || 'output'
const remove = scriptArs[2] || false

const files = []
let childDirs = []

const main = (
  readDir,
  checkDir,
  copyFiles,
  removeDir,
  close
) => {
  readDir()
  checkDir()
  copyFiles()
  removeDir()
}

const readDir = (dir) => {
  const dirs = fs.readdirSync(dir)
  childDirs = dirs.slice()
}

const checkDir = (dir, childDirs) => {
  childDirs.forEach(childDir => {
    const directory = path.join(dir, childDir)

    if (fs.statSync(directory).isDirectory()) {
      const items = fs.readdirSync(directory)
      return checkDir(directory, items)
    }
    return files.push({ name: childDir, path: dir })
  })
  return files
}

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(dir))
    console.log(`Directory: ${dir} create successfully!`)
  }
}

const copyFiles = (files, dir) => {
  files.forEach(file => {
    createDir(dir)
    createDir(path.join(dir, file.name[0]))
    const entry = path.join(file.path, file.name)
    const output = path.join(dir, file.name[0], file.name)
    fs.copyFileSync(entry, output)
    console.log(`File: ${output} copied and sorted!`)
  });
}

const removeDir = (dir) => {
  let files
  const rmSelf = true
  dir = dir + '/';

  try {
    files = fs.readdirSync(dir)
  } catch (e) { 
    console.log(`Directory is not exist!`)
    return
  }

  if (files.length > 0) {
    files.forEach((x) => {
      if (fs.statSync(dir + x).isDirectory()) {
        removeDir(dir + x);
      } else {
        fs.unlinkSync(dir + x);
      }
    });
  }

  if (rmSelf) {
    fs.rmdirSync(dir)
  }

  console.log(`Directory: ${dir} removed!`)
}

main(() => {
  readDir(entry)
}, () => {
  checkDir(entry, childDirs)
}, () => {
  copyFiles(files, output)
}, () => {
  if (remove) removeDir(entry)
})