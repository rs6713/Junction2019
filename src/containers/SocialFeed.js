import React, {Component} from 'react';
import '../App.scss';
import { TweetBody } from './../components/tweet'; //'./components/tweet.js';

import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class SocialFeed extends Component {
  constructor(props){
    super(props)

    this.state={
        users:[]
      }

  }

  getUser() {
    fetch(global.backendURL + 'tweets')
    .then(response => {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(data => {
        this.setState({
          users:data
        });
    })
    .catch(error => {
      console.log(error);
    });
  }

  componentDidMount(){
    this.getUser();
  }

  render(){
    return(
      <div class ="studentads-container">
        SocialFeed
        <div >
        {/* //var name = `${user.name.first} ${user.name.last}`
          let handle = `@${user.name.first}${user.name.last}`
          let image = user.image
          let tweet = user.tweet
          console.log(image) */}
      <div className="main-body">
      <div className="main-body">
        {[...this.state.users].map((user, index) => {
          return(
            <TweetBody 
              key={user.id}
              name={user.name}
              handle={user.handle}
              tweet={user.tweet}
              image={user.image} />
          )
        })}      
      </div>
      </div>
        
        </div>        
      </div>
  
    )
  }

}

export default SocialFeed;