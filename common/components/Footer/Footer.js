import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Footer.css'

@CSSModules(styles)
export default class Footer extends Component {
  render() {
    return (
      <p style={{ fontSize: 13, textAlign: 'center', marginTop: 60, opacity: .5 }}>
        made with <span className="oi" data-glyph="heart"></span> by&nbsp;
        <a href="http://twitter.com/morajabi">@morajabi</a>
      </p>
    );
  }
}
