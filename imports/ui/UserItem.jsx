/*

A single user item in the user List

*/

import React, {Component, PropTypes} from 'react';
import ListItem from 'grommet/components/ListItem';
import {Messages} from '../api/messages.js';
import {createContainer} from 'meteor/react-meteor-data';
import Status from 'grommet/components/icons/Status';

class UserItem extends Component {

    constructor() {
        super();
        this.state = {
            time: new Date().getTime()
        };
    }

    componentDidMount() { // update "typing..." status text every second by comparing current time with lastTypingTime from database
        const ourThis = this;
        Meteor.setInterval(function() {
            ourThis.setState({time: new Date().getTime()})
        }, 1000);
    }

    render() {
        const lastMessageStyle = {
            fontSize: 11
        };
        const unreadStyle = {
            fontSize: 11,
            fontWeight: 'bold'
        }
        const statusStyle = {
            height: 10
        };

        let lastMessageItem = <div/> // "last message" line under username. 
        if (this.props.lastMessage) {
            if (this.props.lastMessage.to == this.props.currentUser._id) {
                if (this.props.lastMessage.read) {
                    lastMessageItem = <div style={lastMessageStyle}>{this.props.lastMessage.text}</div>
                } else {
                    lastMessageItem = <div style={unreadStyle}>{this.props.lastMessage.text}</div>
                }
            } else {
                lastMessageItem = <div style={lastMessageStyle}>{this.props.lastMessage.text}<Status style={statusStyle} value={this.props.lastMessage.read?"ok":"disabled"}/></div>
            }
        }

        return <ListItem onClick={() => this.props.onSelect(this.props.selectedUser)}>
            <div>
                <div>
                    {this.props.selectedUser.username}
                    {this.props.selectedUser.lastTypingTime && this.props.selectedUser.lastTypingTime[this.props.currentUser._id]
                        ? (this.state.time - this.props.selectedUser.lastTypingTime[this.props.currentUser._id].getTime()) < 1000
                            ? " - typing..."
                            : ""
                        : ""}
                </div>
                {lastMessageItem}
            </div>
        </ListItem>

    }
}


UserItem.propTypes = {
  lastMessage: React.PropTypes.object,
  currentUser: React.PropTypes.object.isRequired,
  selectedUser: React.PropTypes.object.isRequired
};


export default createContainer(({currentUser, selectedUser}) => {

    Meteor.subscribe('messages');

    return {
        lastMessage: Messages.findOne({
            $or: [
                {
                    from: currentUser._id,
                    to: selectedUser._id
                }, {
                    from: selectedUser._id,
                    to: currentUser._id
                }
            ]
        }, {
            sort: {
                time: -1,
                limit: 1
            }
        })
    };
}, UserItem);
