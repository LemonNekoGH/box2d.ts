const {exec} = require('child_process')

exec('serve . -l 8080',(error: any, stdout: string, stderr: string) => {
    if (error) {
        console.log(`ErrorCode: ${error.code}, ${error.message}\nStack: ${error.stack}`)
    }
    console.log(stdout)
    console.error(stderr)
})

exec('yarn watch-testbed',(error: any, stdout: string, stderr: string) => {
    if (error) {
        console.log(`ErrorCode: ${error.code}, ${error.message}\nStack: ${error.stack}`)
    }
    console.log(stdout)
    console.error(stderr)
})
