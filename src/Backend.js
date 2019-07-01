class Backend {
  hello(name) {
    console.log(`Hello ${name}`);
    return "Backend is happy";
  }

  setFrontend(frontend) {
    // Node world can now use frontend RPC handle.
    this.frontend_ = frontend;
  }
}
export { Backend };
export default Backend;
