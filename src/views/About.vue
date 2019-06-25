<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="doSomething">click me</button>
    <button @click="asyncMsg">asyncMsg</button>
    <button @click="syncMsg">syncMsg</button>
    <button @click="saveModelBackground">saveModelBackground</button>
    <button @click="saveModelRendererSide">saveModelRendererSide</button>
    <button @click="saveStoreRendererSide">saveStoreRendererSide</button>
  </div>
</template>
<script>
import log from "../log";
import * as path from "path";
// eslint-disable-next-line no-unused-vars
import { app, remote, ipcRenderer } from "electron";
import { MyDemoModel } from "../common/MyDemoModel";
import Datastore from "nedb-promises";

const myrecordrnddev = async () => {
  let title =
    "RND Side" +
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  let myDemo = new MyDemoModel({
    title: title,
    opAt: Date.now()
  });
  await myDemo.save();
  console.log("myrecordrnddev.myDemo", myDemo);
  return myDemo;
};

const myStoreRndDev = async () => {
  const myRndDataStore = Datastore.create({
    filename: path.join(remote.app.getPath("userData"), "myrnddata.db"),
    inMemoryOnly: false,
    autoload: true,
    timestampData: true
  });
  const mystorerecordnew = await myRndDataStore.insert({ doc: "yourrnddoc" });
  console.log("rnd myRndDataStore", mystorerecordnew);
  return mystorerecordnew;
};

export default {
  name: "About",
  created() {
    log.verbose("use about view");

    ipcRenderer.on("asynchronous-reply", (event, arg) => {
      const message = `Asynchronous message reply: ${arg}`;
      console.log(message);
    });
    ipcRenderer.on("record-reply", (event, arg) => {
      console.log("record-reply", arg);
    });
  },
  methods: {
    doSomething() {
      log.verbose("clicked doSomething");
    },
    asyncMsg() {
      log.verbose("enter asyncMsg");
      ipcRenderer.send("asynchronous-message", "ping");
    },
    syncMsg() {
      const reply = ipcRenderer.sendSync("synchronous-message", "ping");
      const message = `Synchronous message reply: ${reply}`;
      log.verbose("syncMsg reply", message);
    },
    saveModelBackground() {
      log.verbose("enter saveModelBackground");
      ipcRenderer.send("record-insert", "arg1");
    },
    saveModelRendererSide() {
      log.verbose("enter saveModelRendererSide");
      (async () => {
        console.log("myrecordrnddev", await myrecordrnddev());
      })().catch(err => {
        console.log(err);
      });
    },
    saveStoreRendererSide() {
      log.verbose("enter saveStoreRendererSide");
      (async () => {
        console.log("mystorerecordrndrec", await myStoreRndDev());
      })().catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
