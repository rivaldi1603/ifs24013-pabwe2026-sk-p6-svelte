import "./trustedTypes.js";
import { mount } from "svelte";
import App from "./App.svelte";
import "./index.css";

const target = document.getElementById("app");
if (target) {
  target.innerHTML = "";
}

const app = mount(App, {
  target,
});

export default app;
