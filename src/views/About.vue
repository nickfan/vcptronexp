<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="doSomething">click me</button>
  </div>
</template>
<script>
import log from "../log";
export default {
  name: "About",
  created() {
    log.verbose("use about view");
  },
  methods: {
    doSomething() {
      log.verbose("clicked doSomething");
    }
  }
};
</script>
