import {Route, Switch, Redirect} from 'react-router-dom'

import HomeRoute from './components/HomeRoute'
import LoginRoute from './components/LoginRoute'
import JobsRoute from './components/JobsRoute'

import ProtectedRoute from './components/ProtectedRoute'
import EachJobDetailsRoute from './components/EachJobDetailsRoute'
import NotFoundRoute from './components/NotFoundRoute'

import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/jobs" component={JobsRoute} />
    <ProtectedRoute exact path="/jobs/:id" component={EachJobDetailsRoute} />
    <Route exact path="/not-found" component={NotFoundRoute} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
