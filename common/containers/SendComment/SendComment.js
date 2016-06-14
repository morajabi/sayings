import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './SendComment.css'
import Account from '../../utils/account'
import axios from 'axios'

@CSSModules(styles)
export default class SendComment extends Component {
  constructor() {
    super()
    this.state = { inputText: '' }
    // TODO: bring text change handler inside componet from `Saying` component.
    this.onInputChange = this.onInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onInputChange(e) {
    this.setState({ inputText: e.target.value })
    // Handle Autosize textarea
    e.target.style.height = '5px'
    e.target.style.height = (e.target.scrollHeight + 5) + 'px'
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.onCommentSubmit(this.state.inputText)
  }

  render() {
    return (
      <div styleName='wrapper'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div styleName='inputWrapper'>
            <textarea
              styleName='input'
              type='text'
              placeholder='Write something ...'
              value={this.state.inputText}
              onChange={this.onInputChange} />
          </div>
          <div styleName='submitWrapper'>
            <button styleName='submit'>submit</button>
          </div>
        </form>
      </div>
    );
  }
}
