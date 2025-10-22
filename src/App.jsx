import "./App.css";
import Router from "./router/Router";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
function App() {
  return (
    <MantineProvider>
      <Router />
    </MantineProvider>
  );
}

export default App;
