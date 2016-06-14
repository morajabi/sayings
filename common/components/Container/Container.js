import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Container.css'

@CSSModules(styles)
export default class Container extends Component {
  render() {
    return <div styleName="container">{this.props.children}</div>;
  }
}
