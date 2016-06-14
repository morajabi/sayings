import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './IconButton.scss'

@CSSModules(styles)
export default class IconButton extends Component {
  render() {
    let { icon, value, onClick, iconStyle, valueStyle } = this.props;
    return (
      <div styleName='wrapper' onClick={onClick}>
        <div styleName='icon' style={iconStyle}>
          <span className="oi" data-glyph={icon}></span>
        </div>
        <span styleName='value' style={valueStyle}>{value}</span>
      </div>
    );
  }
}

IconButton.propTypes = {
  iconStyle: React.PropTypes.object,
  valueStyle: React.PropTypes.object,
  value: React.PropTypes.number,
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func
}

IconButton.defaultProps = {
  iconActiveStyle: {},
  valueActiveStyle: {},
  value: 0,
  icon: ''
}
