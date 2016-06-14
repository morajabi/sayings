import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Logo.css'

@CSSModules(styles)
export default class Logo extends Component {
  render() {
    return (
      <div styleName="logo" {...this.props}>
        <h1 styleName="text">SAY</h1>
      </div>
    );
  }
}
