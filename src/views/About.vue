<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="doSomething">click me</button>
    <button @click="asyncMsg">asyncMsg</button>
    <button @click="syncMsg">syncMsg</button>
    <button @click="saveDbBackground">saveDbBackground</button>
    <button @click="saveDbRendererSide">saveDbRendererSide</button>
  </div>
</template>
<script>
import log from "../log";
import { ipcRenderer } from "electron";
import { MyDemoModel } from "../common/MyDemoModel";

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
    saveDbBackground() {
      log.verbose("enter saveDbBackground");
      ipcRenderer.send("record-insert", "arg1");
    },
    saveDbRendererSide() {
      log.verbose("enter saveDbRendererSide");
      (async () => {
        console.log("myrecordrnddev", await myrecordrnddev());
      })().catch(err => {
        console.log(err);
      });
    }
  }
};
</script>
