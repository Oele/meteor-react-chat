/*

The user Collection

*/

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


if (Meteor.isServer) {
  Meteor.publish('users', function () {
    return Meteor.users.find({}, {fields: {'username':1, 'lastTypingTime': 1}});
  });
}

Meteor.methods({
  'users.settyping'(receiver) {
    check(receiver, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: this.userId}, {$set: {['lastTypingTime.'+receiver]: new Date()}});

  }
});
