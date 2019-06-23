import React from 'react';
import {hot} from 'react-hot-loader';
import {ThemeProvider} from 'styled-components';
import {Route, Switch} from 'react-router-dom';

import theme from '/theme';

import HomeView from '/component/view/HomeView';
import AboutView from '/component/view/AboutView';
import ContactView from '/component/view/ContactView';
import NotFoundView from '/component/view/NotFoundView';

const AppRoot = (): React.ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/" component={HomeView} />
        <Route exact path="/about" component={AboutView} />
        <Route exact path="/contact" component={ContactView} />
        <Route component={NotFoundView} />
      </Switch>
    </ThemeProvider>
  );
};

AppRoot.rootElementId = 'root';

export default hot(module)(AppRoot);
