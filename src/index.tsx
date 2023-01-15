/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";

render(() => {
  return <App />;
}, document.getElementById("root") as HTMLElement);
