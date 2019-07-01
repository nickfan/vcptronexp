class Frontend {
  hello(name) {
    console.log(`Hello ${name}`);
    return "Frontend is happy";
  }
  setBackend(backend) {
    // Node world can now use frontend RPC handle.
    this.backend = backend;
  }
}
export { Frontend };
export default Frontend;
