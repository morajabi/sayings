import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './SayingList.css'

import Saying from '../Saying/Saying'

import avatar from '../../images/avatar.jpg'

@CSSModules(styles)
export default class SayingList extends Component {
  render() {
    let sayings = this.props.data.map((saying) => {
      return (
        <Saying
          key={saying.id}
          id={saying.id}
          name={saying.user.fullname}
          date={saying.createdAt}
          likesCount={saying.likesCount}
          isLiked={saying.isLiked}
          commentsCount={saying.commentsCount}
          url="/profile/{saying.user.username}"
          avatarImage={saying.user.avatar ? `./server/${saying.user.avatar}` : ''}>
          {saying.text}
        </Saying>
      );
    })
    return (
      <div>
        {sayings}
      </div>
    );
  }
}
