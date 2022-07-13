import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Nav } from "./component/nav";


// page :::::::::::::::::

import { Explore } from "./component/page/explore";
import { Mint } from "./component/page/mint";
import { Asset } from "./component/page/asset";
import { Market } from "./component/page/market";

import './App.css';

function App() {
  return (
    <Router>
      <Nav></Nav>

      <Switch>

        <Route exact path='/'>
          <Explore></Explore>
        </Route>

        <Route exact path='/mint'>
          <Mint></Mint>
        </Route>

        <Route exact path='/asset'>
          <Asset></Asset>
        </Route>

        <Route exact path='/market/:token_id' children={<Market />}>
         
        </Route>

        
      </Switch>

    </Router>
  );
}

export default App;
