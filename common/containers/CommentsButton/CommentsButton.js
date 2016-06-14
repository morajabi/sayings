import React, { Component } from 'react'

import IconButton from '../../components/IconButton/IconButton'

export default class CommentsButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      iconStyle: {},
      valueStyle: {}
    }
    this.iconActiveStyle = { color: 'rgb(44, 78, 97)' }
    this.valueActiveStyle = { color: 'rgb(44, 78, 97)' }
  }

  handleClick(e) {
    this.setState({
      iconStyle: !Object.keys(this.state.iconStyle).length ? this.iconActiveStyle : {},
      valueStyle: !Object.keys(this.state.valueStyle).length ? this.valueActiveStyle : {}
    });
    this.props.onClick()
  }

  render() {
    let { iconStyle, valueStyle } = this.state;

    return (
      <IconButton
        value={this.props.value}
        icon='chat'
        iconStyle={iconStyle}
        valueStyle={valueStyle}
        onClick={this.handleClick.bind(this)} />
    );
  }
}
