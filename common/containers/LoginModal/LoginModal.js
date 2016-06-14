import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './LoginModal.css'
import Account from '../../utils/account'
import axios from 'axios'

import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'

@CSSModules(styles)
export default class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', btn: {text: 'Submit', appearance: 'mediumBlack'} }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    // Req server
    this.setState({ btn: { text: 'wait...' } });
    // TODO: disable button until server responses
    axios.post('http://localhost:3000/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then((res) => {
        console.log(res);
        if (res.data.error.trim() === '') {
          // Success
          Account.login(res.data.token)
          this.setState({ btn: { text: 'Successful', appearance: 'mediumGreen' } });
          this.props.onClose()
        }
      })
      .catch((res) => {
        console.log(res);
        alert(res.data.error)
        this.setState({ btn: { text: 'Try Again', appearance: 'mediumRed' } });
        console.log(res);
      });
  }

  render() {
    return (
      <Modal
        title='Login'
        onClose={this.props.onClose}>
        <p> Come on. Login to your account and SAY something again. Don't have an account? <a href="#">Signup</a> now.</p>
        <form onSubmit={this.handleSubmit}>
          <Input
            placeholder='Your Username'
            type='text'
            value={this.state.username}
            onChange={this.handleUsernameChange} />
          <Input
            placeholder='The Secret Password'
            type='password'
            value={this.state.password}
            onChange={this.handlePasswordChange} />
          <div style={{ textAlign: 'center' }}>
            <Button appearance={this.state.btn.appearance}>{this.state.btn.text}</Button>
          </div>
        </form>
      </Modal>
    );
  }
}
