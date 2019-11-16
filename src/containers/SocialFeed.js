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

        var users = [];
        data.forEach(tweet => {
            users.push({
                name: tweet.id,
                image: tweet.image,
                tweet: tweet.text
            });
        });

        this.setState(users);
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

        <div className="main-body">
        {[...this.state.users].map((user, index) => {
          let name = `${user.name.first} ${user.name.last}`
          let handle = `@${user.name.first}${user.name.last}`
          let image = user.image
          let tweet = user.tweet
          console.log(image)
          return(
            <TweetBody 
              key={index}
              name={name}
              handle={handle}
              tweet={tweet}
              image={image} />
          )
        })}      
      </div>
        
        </div>        
      </div>
  
    )
  }

}

export default SocialFeed;