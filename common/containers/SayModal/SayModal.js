import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './SayModal.css'
import Account from '../../utils/account'
import axios from 'axios'

import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'

@CSSModules(styles)
export default class SayModal extends Component {
  constructor(props) {
    super(props);
    this._initialState = {
      inputText: '',
      submitText: 'Submit',
      submitClass: 'smallBlack',
      errorText: ''
    }
    this.state = this._initialState

    // Bind `this` to all methods
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  setIntialState() {
    this.setState(this._initialState);
  }

  handleInputChange(e) {
    this.setState({ inputText: e.target.value })
  }

  sendSayingToServer(sayingText) {
    const sendSayingURL = `http://localhost:3000/saying`
    return new Promise((resolve, reject) => {
      let data = {
        text: sayingText
      }
      let config = {
        headers: {'authorization': Account.getToken()}
      }
      axios.post(
        sendSayingURL,
        data,
        config,
      ).then((res) => {
        resolve()
      })
      .catch((res) => {
        reject(new Error(res || res.message || ''))
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.sendSayingToServer(this.state.inputText)
      .then(() => {
        this.setState({ inputText: '', submitText: 'Successful!', submitClass: 'smallGreen' })
        this.props.onSuccess()
        this.props.onClose()
      })
      .catch((err) => {
        this.setState({ submitText: 'Try Again', submitClass: 'smallRed', errorText: err.message  })
      })
  }

  render() {
    return (
      <Modal
        title='Say What You Want'
        onClose={this.props.onClose}>
        <p> SAY is where you can say whatever you want without being ashamed, so Say What's in Your Mind! </p>
        <form onSubmit={this.handleSubmit}>
          <Input placeholder='Type something...' type='textarea' value={this.state.inputText} onChange={this.handleInputChange} />
          <p
            style={{ color: 'rgb(209, 59, 32)', margin: '10px 0', textAlign: 'center' }}>
            {this.state.errorText}</p>
          <div style={{ textAlign: 'center' }}>
            <Button appearance={this.state.submitClass}>{this.state.submitText}</Button>
          </div>
        </form>
      </Modal>
    );
  }
}
