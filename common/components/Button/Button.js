import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Button.scss'
console.log('s');
class Button extends Component {
  constructor() {
    super();
  }
  render() {
    let { appearance, styles, ...other } = this.props;
    return (
      <div>
        <button className={styles[appearance]} {...other}>{other.children}</button>
      </div>
    );
  }
}
Button.propTypes = {
  appearance: React.PropTypes.string.isRequired
}
Button.defaultProps = {
  appearance: 'mediumBlack'
}

export default CSSModules(Button, styles)
