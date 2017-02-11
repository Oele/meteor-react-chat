/*

The right side of the screen with the message list & the input Box

*/

import React, {Component, PropTypes} from 'react';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import MessageList from './MessageList';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import ReactDOM from 'react-dom';

export default class ChatPane extends Component {

    constructor() {
        super();
        this.isThrottled = false;
    }

    render() {
        textInputStyle = {
            width: '100%'
        };

        return <Box full={true}>
            <Header>
                <Title>{this.props.selectedUser.username}</Title>
            </Header>
            <Box flex={true}>
                <MessageList currentUser={this.props.currentUser} selectedUser={this.props.selectedUser}/>
            </Box>
            <Footer>
                <Form onSubmit={this.onSubmit.bind(this)} style={{
                    width: '100%'
                }}>
                    <FormField style={textInputStyle}>
                        <TextInput style={textInputStyle} ref="textInput" onDOMChange={this.onUserInput.bind(this)} value={this.props.value}></TextInput>
                    </FormField>
                </Form>
            </Footer>
        </Box>

    }

    componentDidMount() { // auto focus on the input box
        ReactDOM.findDOMNode(this.refs.textInput).focus();
    }

    onUserInput() { // only update "typing" once per second
        this.props.onUpdate(ReactDOM.findDOMNode(this.refs.textInput).value);
        if (this.isThrottled) {
            return;
        }
        this.isThrottled = true;
        var ourThis = this;
        setTimeout(function() {
            ourThis.isThrottled = false;
        }, 1000);

        Meteor.call('users.settyping', this.props.selectedUser._id);
    }

    onSubmit(e) { // send message
        e.preventDefault();
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        if (text=='') {
          return
        }

        Meteor.call('messages.send', this.props.selectedUser._id, text);

        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        this.props.onUpdate(ReactDOM.findDOMNode(this.refs.textInput).value);
    }

}

ChatPane.propTypes = {
    currentUser: React.PropTypes.object.isRequired,
    selectedUser: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
};
