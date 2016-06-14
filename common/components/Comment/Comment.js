import React, { Component, PropTypes } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Comment.scss'
import moment from 'moment'

@CSSModules(styles)
export default class Comment extends Component {
  render() {
    let { url, name, children, date } = this.props
    return (
      <div styleName='comment'>
        <article>
          <header styleName='head'>
            <span styleName='name'>
              <a href="{url}"><cite>{name}</cite></a>
            </span>
            <span styleName='date'>
              {moment(date, "X").fromNow()}
            </span>
          </header>
          <p styleName='body'>
            {children}
          </p>
        </article>
      </div>
    )
  }
}

Comment.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node
  ])
}

Comment.defaultProps = {
  url: '',
  name: 'Unknown',
  date: 0,
  children: '--'
}
