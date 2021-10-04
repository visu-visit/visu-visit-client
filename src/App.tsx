import { Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import FileLocationDescription from "./components/FileLocationDescription";

import NotFound from "./components/NotFound";
import History from "./pages/History";
import Introduction from "./pages/Introduction";
import GlobalStyles from "./styles/GlobalStyles";
import { theme } from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Switch>
        <Route exact path="/">
          <Introduction />
        </Route>
        <Route exact path="/description-about-browser-history-location">
          <FileLocationDescription />
        </Route>
        <Route exact path="/browser-history/:id">
          <History />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
