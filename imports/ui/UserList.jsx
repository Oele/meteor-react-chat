/*

The user list on the left side of the screen

*/

import React, {Component, PropTypes} from 'react';
import List from 'grommet/components/List';
import UserItem from './UserItem'

export default class UserList extends Component {

    render() {
        return <List selectable={true}>
            {this.props.allUsers.map((user) => (<UserItem onSelect={this.props.onSelect} selectedUser={user} key={user._id} currentUser={this.props.currentUser}/>))
}
        </List>
    }

}



UserList.propTypes = {
  allUsers: React.PropTypes.array.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.object.isRequired
};
