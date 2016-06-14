import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Input.scss'

import autoSize from 'autosize'

@CSSModules(styles)
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false }
  }
  componentWillUnmount() {
    if (this.textarea)
      autosize.destroy(this.textarea);
  }
  render() {
    let wrapperClass = this.state.focused ? `${styles.wrapper} ${styles.focused}` : styles.wrapper
    if (this.props.type === 'textarea') {
      // render textarea
      return (
        <div className={wrapperClass}>
          <textarea
            ref={(t) => {
              this.textarea = t
              autoSize(t)
            }}
            styleName='textarea' {...this.props}
            onFocus={() => { this.setState({ focused: true }) }}
            onBlur={() => { this.setState({ focused: false }) }} />
        </div>
      );
    }
    else {
      // render input
      return (
        <div className={wrapperClass}>
          <input
            styleName='input' {...this.props}
            onFocus={() => { this.setState({ focused: true }) }}
            onBlur={() => { this.setState({ focused: false }) }}  />
        </div>
      );
    }
  }
}
