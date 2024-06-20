import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import history from 'history/browser';

import Home from './Home';
import Authentication from './Authentication';
// import Reality from './Reality';
// import Ocean from './Ocean';
import AI from './AI';
// import Contact from './Contact';
import Registration from './Registration.tsx';
// import SignIn from './SignIn';
import Resume from './Resume';
// import MyNumber from './MyNumber';
// import Navigation from './Navigation';
import NotFound from './NotFound';
// import { GlobalProvider } from '../context/globalstate';

import GlobalStyle from "../../styles/globalstyle.ts";

const App: React.FunctionComponent = () => {
  // let history = useHistory();
  // let location = history.location;

  // let unlisten = history.listen(({location, action}) => {
  //     console.log(action, location.pathname, location.state);
  // });
  // unlisten();
  return (
    <>
      {/*<header>*/}
      {/*  <Navigation/>*/}
      {/*</header>*/}
      <GlobalStyle/>
      <main>
        {/*<GlobalProvider>*/}
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/authentication'} element={<Authentication />} />
            {/*<Route path={'/reality'} element={<Reality />} />*/}
            {/*<Route path={'/ocean'} element={<Ocean />} />*/}
            <Route path={'/ai'} element={<AI />} />
            {/*<Route path={'/contact'} element={<Contact />} />*/}
            <Route path={'/registration'} element={<Registration />} />
            {/*<Route path={'/signin'} element={<SignIn />} />*/}
            <Route path={'/resume'} element={<Resume />} />
            {/*<Route path={'/mynumber'} element={<MyNumber />} />*/}
            <Route element={<NotFound />} />
          </Routes>
        {/*</GlobalProvider>*/}
      </main>
    </>
  );
};

export default App;
