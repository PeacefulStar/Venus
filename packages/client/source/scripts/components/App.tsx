import React from 'react';
import {Route, Routes} from 'react-router-dom';
// import history from 'history/browser';

import Home from './Home';
import Reality from './Reality';
import Ocean from './Ocean';
import AI from './AI';
import Contact from './Contact';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Resume from './Resume';
// import MyNumber from './MyNumber';
import Navigation from './Navigation';
import NotFound from './NotFound';
import {AddEmployee} from './AddEmployee';
import {EditEmployee} from './EditEmployee';
import {EmployeeList} from './EmployeeList';
import {GlobalProvider} from '../context/globalstate';

import '../../styles/scss/main.module.scss';

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
      <main>
        <GlobalProvider>
          <Routes>
            <Route path={'/'} element={<Home/>}/>
            <Route path={'/reality'} element={<Reality/>}/>
            <Route path={'/ocean'} element={<Ocean/>}/>
            <Route path={'/ai'} element={<AI/>}/>
            <Route path={'/contact'} element={<Contact/>}/>
            <Route path={'/signup'} element={<SignUp/>}/>
            <Route path={'/signin'} element={<SignIn/>}/>
            <Route path={'/resume'} element={<Resume/>}/>
            {/*<Route path={'/mynumber'} element={<MyNumber />} />*/}
            <Route path="/add" element={<AddEmployee/>}/>
            <Route path="/edit/:id" element={<EditEmployee/>}/>
            <Route path="/list" element={<EmployeeList/>}/>
            <Route element={<NotFound/>}/>
          </Routes>
        </GlobalProvider>
      </main>
    </>
  );
};

export default App;
