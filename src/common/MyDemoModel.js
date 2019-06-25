import * as path from "path";
import * as fs from "fs-extra";
import { app, remote } from "electron";
// eslint-disable-next-line no-unused-vars
import Datastore from "nedb-promises";
import { Model, Timestamps } from "nedb-models";

const APP = process.type === "renderer" ? remote.app : app;
const STORE_PATH = APP.getPath("userData");
const DB_BASE_PATH = path.join(STORE_PATH, "db");
if (process.type !== "renderer") {
  if (!fs.pathExistsSync(DB_BASE_PATH)) {
    fs.mkdirpSync(DB_BASE_PATH);
  }
}

class MyDemoModel extends Model {
  static getClassName() {
    return "MyDemoModel";
  }

  static modelName() {
    const modName = this.getClassName().slice(0, -5);
    return modName.charAt(0).toLowerCase() + modName.slice(1);
  }

  static dbPathDefault(name, basePath) {
    if (!name) {
      name = this.modelName();
    }
    if (!basePath) {
      // basePath = converter(this).getBasePath();
      basePath = DB_BASE_PATH;
    }
    const dbFilePath = path.join(basePath, `${name}.db`);
    // console.log("dbFilePath", dbFilePath);
    return dbFilePath;
  }

  static datastore() {
    // const datastore = Datastore.create({
    //   filename: this.dbPathDefault(),
    //   inMemoryOnly: false,
    //   autoload: true,
    //   timestampData: true
    // });
    // datastore.__original.persistence.compactDatafile();
    // return datastore;
    return {
      filename: this.dbPathDefault("myDemo")
    };
  }

  getClassName() {
    return this.getClass().getClassName();
  }

  getClass() {
    return this.constructor;
  }
}

MyDemoModel.use(Timestamps);
export { MyDemoModel, DB_BASE_PATH };
export default MyDemoModel;
