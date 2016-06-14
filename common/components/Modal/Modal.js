import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CSSModules from 'react-css-modules'
import styles from './Modal.scss'

@CSSModules(styles)
export default class Modal extends Component {
  handleClose(e) {
    this.props.onClose()
  }
  render() {
    let { children, title } = this.props;
    let titleNode = title ? <h2 styleName='title'>{title}</h2> : ''
    return (
      <div styleName='wrapper' onClick={this.handleClose.bind(this)}>
        <div styleName='modal' onClick={(e) => { e.stopPropagation() }}>
          <div styleName='close' onClick={this.handleClose.bind(this)}>
            <span className="oi" data-glyph="x"></span>
          </div>
          {titleNode}
          <div styleName='content'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  onClose: PropTypes.func
}

Modal.defaultProps = {
  title: '',
  children: '',
  onClose: () => {}
}
