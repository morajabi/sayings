import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Saying.scss'
import moment from 'moment'
import axios from 'axios'
import Account from '../../utils/account'

import LikeButton from '../../containers/LikeButton/LikeButton'
import CommentsButton from '../../containers/CommentsButton/CommentsButton'
import CommentsList from '../CommentsList/CommentsList'
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react'
import defaultAvatar from '../../images/default-avatar.png';

@CSSModules(styles)
export default class Saying extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentsCount: props.commentsCount,
      showComments: false,
      commentsLoaded: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ commentsCount: nextProps.commentsCount })
  }

  loadComments(resolve = () => {}, reject = () => {}) {
    axios.get(`http://localhost:3000/comments/${this.props.id}`).then((res) => {
      console.log(res);
      this.setState({ comments: res.data, commentsLoaded: true, commentsCount: res.data.length })
      resolve()
    })
    .catch((res) => {
      console.log(res);
      reject()
    })
  }

  handleComments(e) {
    let p = new Promise((resolve, reject) => {
      if (!this.state.commentsLoaded) {
        this.loadComments(resolve, reject)
      } else {
        resolve()
      }
    })
    .then(() => {
      this.setState({ showComments: !this.state.showComments })
    })
  }



  sendComment(commentText) {
    // Check if user is logged in and token is available
    if (!Account.isLoggedIn()) {
      // TODO: redirect to login page
      alert('Please login to do this action.')
      return;
    }
    let send = new Promise((resolve, reject) => {
      let data = {
        sayingID: this.props.id,
        text: commentText
      }
      let config = {
        headers: {'authorization': Account.getToken()}
      }
      const sendCommentURL = `http://localhost:3000/comment/`;
      axios.post(
        sendCommentURL,
        data,
        config,
      ).then((res) => {
        console.log(res);
        this.loadComments()
        resolve()
      })
      .catch((res) => {
        console.log(res);
        reject()
      })
    })
    .then(() => {

    })
  }

  render() {
    return (
      <div styleName='saying'>
        <div styleName='avatar'>
          <img
            styleName='avatarImage'
            src={this.props.avatarImage == '' ? defaultAvatar : this.props.avatarImage}
            width='40'
            height='40' />
        </div>
        <div styleName='content'>

          <header styleName='head'>
            <span styleName='name'>
              <a href="{this.props.url}"><cite>{this.props.name}</cite></a>
            </span>
            <span styleName='date'>
              {moment(this.props.date, "X").fromNow()}
            </span>
          </header>

          <p styleName='body'>
            {this.props.children}
          </p>

          <div styleName='buttons'>
            <CommentsButton
              value={parseInt(this.state.commentsCount)}
              onClick={this.handleComments.bind(this)} />

            <LikeButton
              sayingID={this.props.id}
              isLiked={this.props.isLiked}
              value={this.props.likesCount}
              sayingID={this.props.id} />
          </div>

          <VelocityComponent animation={ this.state.showComments ? 'slideDown' : 'slideUp' } duration={200}>
            <div styleName='comments'>
              <CommentsList
                comments={this.state.comments}
                onCommentSubmit={this.sendComment.bind(this)} />
            </div>
          </VelocityComponent>

        </div>
      </div>
    );
  }
}
