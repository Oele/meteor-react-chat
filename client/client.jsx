import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import OurApp from '../imports/ui/OurApp.jsx';

Meteor.startup(() => {
  render(<OurApp />, document.getElementById('render-target'));
});
