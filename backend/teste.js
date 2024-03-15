const {exec} = require('child_process')

exec("VBoxManage list vms", (error, stdout, stderr) => {
  if(error) {
    console.log(`error: ${error.message}`)
    return
  }

  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})