<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="doSomething">click me</button>
    <button @click="asyncMsg">asyncMsg</button>
    <button @click="syncMsg">syncMsg</button>
    <button @click="check4Update">check4Update</button>
  </div>
</template>
<script>
import log from "../log";
// eslint-disable-next-line no-unused-vars
import { app, remote, ipcRenderer } from "electron";

export default {
  name: "About",
  created() {
    log.verbose("use about view");
    ipcRenderer.on("asynchronous-reply", (event, arg) => {
      const message = `Asynchronous message reply: ${arg}`;
      console.log(message);
    });
    ipcRenderer.on("check4update-reply", (event, arg) => {
      console.log("check4update-reply", arg);
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
    check4Update() {
      log.verbose("enter check4Update");
      ipcRenderer.send("check4update", "arg1");
    }
  }
};
</script>
