const path = require('path');
const fs = require('fs');

const scriptArgs = process.argv.slice(2);

const INPUT_PATH = path.normalize(path.join(__dirname, scriptArgs[0] || 'input'));
const OUTPUT_PATH = path.normalize(path.join(__dirname, scriptArgs[1] || 'output'));
const RM_INPUT = scriptArgs[2];

const readDirectory = (input) => {
  try {
    const pathCreater = (path) => fs.existsSync(path) ? null : fs.mkdirSync(path);
    pathCreater(OUTPUT_PATH);

    fs
      .readdirSync(input)
      .forEach(file => {
        let localBase = path.join(input, file);
        let state = fs.statSync(localBase);
        let fileLit = file.charAt(0).toLocaleUpperCase();
        let newPath = path.join(OUTPUT_PATH, fileLit);

        if (state.isFile()) {
          pathCreater(newPath);
          fs.readFileSync(localBase);
          fs.writeFileSync(path.join(newPath, file), localBase);

          RM_INPUT === 'delete' ? fs.unlinkSync(localBase) : null;
        } else {
          readDirectory(localBase);
        }
      });

      RM_INPUT === 'delete' ? fs.rmdirSync(input) : null;
  } catch (error) {
    console.log(error);
  }
};

readDirectory(INPUT_PATH);
