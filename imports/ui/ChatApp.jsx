/*

The actual chat app

*/

import React, { Component, PropTypes } from 'react';
import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LogoutIcon from 'grommet/components/icons/base/Logout';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import UserList from './UserList';
import ChatPane from './ChatPane';
import Button from 'grommet/components/Button';

export default class ChatApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedUser: '',
      inputText: {}
    };
  }


  render() {
    return <Split flex="right" showOnResponsive="both" separator={true}>
      <Sidebar>
        <Header><Button plain={true} icon={<LogoutIcon />} onClick={() => Meteor.logout()} /><Title>{this.props.currentUser.username}</Title></Header>
        <UserList allUsers={this.props.allUsers} currentUser={this.props.currentUser} onSelect={(selected) => this.setState({selectedUser: selected})} />
      </Sidebar>
      {
        this.state.selectedUser? <ChatPane currentUser={this.props.currentUser} selectedUser={this.state.selectedUser} value={this.state.inputText[this.state.selectedUser._id] ? this.state.inputText[this.state.selectedUser._id] : ""} onUpdate={this.onUpdate.bind(this)}/> : <Box />
        }
    </Split>
  }


  onUpdate (text) { // separate input box content per user
    this.setState({inputText: {
      ...this.state.inputText,
      [this.state.selectedUser._id]: text
    }}) ;
  }

}

ChatApp.propTypes = {
  currentUser: React.PropTypes.object.isRequired,
  allUsers: React.PropTypes.array.isRequired
};
