import React, { Component } from 'react'
import Account from '../../utils/account'
import axios from 'axios'

import IconButton from '../../components/IconButton/IconButton'

export default class LikeButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iconStyle: {},
      valueStyle: {},
      liked: props.isLiked,
      likesCount: props.value
    }
    this.iconActiveStyle = { color: 'rgb(224, 39, 28)' }
    this.valueActiveStyle = { color: 'rgb(224, 39, 28)' }
  }

  toggleIcon() {
    this.setState({
      iconStyle: !Object.keys(this.state.iconStyle).length ? this.iconActiveStyle : {},
      valueStyle: !Object.keys(this.state.valueStyle).length ? this.valueActiveStyle : {},
      liked: !this.state.liked,
      likesCount: this.state.liked ? this.state.likesCount-1 : this.state.likesCount+1
    });
  }

  handleClick(e) {
    // Check if user is logged in and token is available
    if (!Account.isLoggedIn()) {
      // TODO: redirect to login page
      alert('Please login to do this action.')
      return;
    }

    let doLike = new Promise((resolve, reject) => {
      let data = {
        sayingID: this.props.sayingID
      }
      let config = {
        headers: {'authorization': Account.getToken()}
      }
      const likeURL = `http://localhost:3000/like/`;
      const unlikeURL = `http://localhost:3000/unlike/`;
      axios.post(
        this.state.liked ? unlikeURL : likeURL,
        data,
        config,
      ).then((res) => {
        console.log(res);
        resolve()
      })
      .catch((res) => {
        console.log(res);
        reject()
      })
    })
    .then(() => {
      this.toggleIcon()
    })

    this.props.onClick()
  }

  render() {
    let { iconStyle, valueStyle } = this.state;

    return (
      <IconButton
        value={this.state.likesCount}
        icon='heart'
        iconStyle={iconStyle}
        valueStyle={valueStyle}
        onClick={this.handleClick.bind(this)} />
    );
  }
}

LikeButton.defaultProps = {
  onClick: () => {},
  isLiked: false
}
