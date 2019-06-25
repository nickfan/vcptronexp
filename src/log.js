import * as log from "electron-log";
log.transports.file.fileName = "myapp.log";
if (process && process.env && process.env.DEBUG_MODE) {
  //
}
log.transports.file.level = "silly";
log.transports.console.level = "silly";
const logOptions = {
  showDialog: true,
  onError: err => {
    console.error(err);
  }
};
log.catchErrors(logOptions);
export { log };
export default log;
