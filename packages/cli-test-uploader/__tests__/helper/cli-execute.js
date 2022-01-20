const exec = require('child_process').exec;

const execute = async (cliPath, args, cwd) => {
    return new Promise(resolve => { 
      exec(`THUNDRA_UPLOADER_LOG_LEVEL=debug node ${cliPath} ${args.join(' ')}`,
      {  }, 
      (error, stdout, stderr) => { 
          resolve({
            code: error && error.code ? error.code : 0,
            error,
            stdout,
            stderr 
        });
    })
})};

module.exports = {
    execute,
}