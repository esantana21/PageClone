const inquirer = require('inquirer');
const fs = require('fs-extra');

const generate = (name, basePage) => {
  fs.readdir(basePage || './baseCrud', async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const res = data.map(async element => await fs.copySync(`${basePage || './baseCrud'}/${element}`, `${name}/${element}`));

    await Promise.allSettled(res);

    findFiles(name);
  });
};

const findFiles = (path, name) => {
  fs.readdir(path, async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    data.forEach(async e => {
      const pathelement = `${path}/${e}`;
      const stats = fs.lstatSync(pathelement);

      if (stats.isDirectory()) {
        findFiles(pathelement, name || path);
      } else {
         fs.readFile(pathelement, 'utf8', function (err, dat) {
          if (err) {
            return console.log(err);
          }
          var result = dat.replace(/XXXX/g, name || path);

          fs.writeFile(pathelement, result, 'utf8', function (err) {
            if (err) return console.log(err);
            fs.renameSync(pathelement, pathelement.replace(/XXXX/g, name || path));
          });

          
        });
      }
    });
  });
};

inquirer
  .prompt([
    { name: 'pagename', message: 'page name?' },
    { name: 'endpoint', message: 'end-point?' },
    { name: 'atribute', message: 'response atribute?' },
  ])
  .then(answers => {
    generate(answers.pagename);
  })
  .catch(error => {
    console.log(error);
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
