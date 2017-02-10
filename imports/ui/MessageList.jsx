/*

The message List

*/

import React, {Component, PropTypes} from 'react';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import ReactDOM from 'react-dom';
import Status from 'grommet/components/icons/Status';
import {createContainer} from 'meteor/react-meteor-data';
import {Messages} from '../api/messages.js';

class MessageList extends Component {

    render() {

        const timeStyle = {
            fontSize: 11,
            display: 'block'
        };

        const statusStyle = {
            height: 15
        };

        return <List selectable={false} ref="messageList">
            {this.props.messages.map((message) => (message.from == this.props.currentUser._id
                ? <ListItem key={message._id} justify="end" ref={message._id}>
                        <div>
                            <div>{message.text}</div>
                            <div style={timeStyle}>{message.time.toLocaleString()}<Status style={statusStyle} value={message.read
                        ? "ok"
                        : "disabled"}/></div>
                        </div>
                    </ListItem>
                : <ListItem key={message._id} justify="start">
                    <div>
                        <div>{message.text}</div>
                        <div style={timeStyle}>{message.time.toLocaleString()}</div>
                    </div>
                </ListItem>))
}
        </List>
    }

    scrollToBottom() { // always scroll to the bottom of the message list

        const messageList = ReactDOM.findDOMNode(this.refs.messageList);
        const lastMessage = this.props.messages[this.props.messages.length-1];
        const lastMessageId = lastMessage._id;
        const lastMessageElement = ReactDOM.findDOMNode(this.refs[lastMessageId]);

        if (lastMessageElement && lastMessageElement.scrollIntoView) { // non-standard, but works in Chrome & Firefox. Needed in Firefox.
          lastMessageElement.scrollIntoView();
          return;
        }

        // standards compliant, but not working in Firefox:
        const scrollHeight = messageList.scrollHeight;
        const height = messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;

        const target = maxScrollTop > 0
            ? maxScrollTop
            : 0;

        messageList.scrollTop = target;

    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentDidMount() {
        this.scrollToBottom();
    }

}

MessageList.propTypes = {
    currentUser: React.PropTypes.object.isRequired,
    messages: React.PropTypes.array.isRequired
};

export default createContainer(({currentUser, selectedUser}) => {
    Meteor.call('messages.markread', selectedUser._id);
    Meteor.subscribe('messages');

    return {
        messages: Messages.find({
            $or: [
                {
                    from: currentUser._id,
                    to: selectedUser._id
                }, {
                    from: selectedUser._id,
                    to: currentUser._id
                }
            ]
        }).fetch()
    };
}, MessageList);
