/*

This is the main app component. Will display either a login box or the chat app.

*/

import React, { Component, PropTypes } from 'react';

import App from 'grommet/components/App';
import 'grommet/grommet.min.css';
import { Accounts } from 'meteor/std:accounts-basic';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ChatApp from './ChatApp';
import Users from '../api/users.js';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

class OurApp extends Component {

  render() { // if logged in, show chat app, otherwise show login form
    return (
        <App>
          {this.props.currentUser ?
          <ChatApp currentUser={this.props.currentUser} allUsers={this.props.allUsers} /> : <Accounts.ui.LoginForm /> }
        </App>
    );
  }
}


OurApp.propTypes = {
  currentUser: React.PropTypes.object,
  allUsers: React.PropTypes.array
};


export default createContainer(() => {
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.user(),
    allUsers: Meteor.user() ? Meteor.users.find({_id: {$ne: Meteor.user()._id}}).fetch() : null
  };
}, OurApp);
