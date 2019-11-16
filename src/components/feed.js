import React, { Component } from 'react';
import { TweetBody } from './components/tweet.js'


// https://blog.usejournal.com/build-a-simple-twitter-like-feed-using-reactjs-181b67b648a1
class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="main-body">
        <TweetBody 
          name="Haseeb"
          handle="@karthikkalyan90"
          tweet="worldhello"/>
      </div>
    );
  }
}

export default Feed