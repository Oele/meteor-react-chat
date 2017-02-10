/*

The messages Collection

*/

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  Meteor.publish('messages', function messagesPublication() {
    return Messages.find({$or: [{from: this.userId}, {to: this.userId}]});
  });
}

Meteor.methods({
  'messages.send'(receiver, text) {
    check(receiver, String);
    check(text, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Messages.insert({
      text,
      time: new Date(),
      from: this.userId,
      to: receiver,
      read: false
    });
  },
  'messages.markread'(from) {
    check(from, String);

    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.update({from: from, to: this.userId}, {$set: {'read': true}}, {multi: true});

  }
});
