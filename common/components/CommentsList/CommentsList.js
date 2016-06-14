import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './CommentsList.scss'

import Comment from '../Comment/Comment'
import SendComment from '../../containers/SendComment/SendComment'

@CSSModules(styles)
export default class CommentsList extends Component {
  render() {
    let comments = this.props.comments.map((c) => {
      return (
        <Comment
          key={c.id}
          url={`/profile/${c.user.username}`}
          name={c.user.fullname}
          date={c.createdAt}
          >
          {c.text}
        </Comment>
      );
    })
    return (
      <div>
        <SendComment
          sayingID={this.props.sayingID}
          inputText={this.props.commentInputText}
          onCommentSubmit={this.props.onCommentSubmit}
          onInputChange={this.props.onCommentInputChange}/>

        {comments}
      </div>
    );
  }
}
