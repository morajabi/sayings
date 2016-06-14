import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './SignupModal.css'
import axios from 'axios'
import Dropzone from 'react-dropzone'

import Modal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'

@CSSModules(styles)
export default class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fullname: '',
      email: '',
      avatar: {preview:''},
      btn: { text: 'Submit', appearance: 'mediumBlack'},
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleFullnameChange = this.handleFullnameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleFullnameChange(e) {
    this.setState({ fullname: e.target.value })
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  onDrop(files) {
    console.log('Received files: ', files);
    let file = files[0]
    if (/(jp(e)?g|png|gif)$/.test(file.type)) {
      this.setState({ avatar: file })
    } else {
      this.setState({ error: 'Only images formatted PNG,JPG and GIF are supported.' })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    // Validate data
    if (this.state.username === '' || this.state.password === '' || this.state.email === '') {
      this.setState({ error: 'Some required fields are empty!' })
      return;
    }
    // Request server
    this.setState({ btn: { text: 'wait...' } });
    var data = new FormData();
          data.append('username', this.state.username);
          data.append('password', this.state.password);
          data.append('fullname', this.state.fullname);
          data.append('email', this.state.email);
          data.append('avatar', this.state.avatar);

    axios.post('http://localhost:3000/signup', data)
      .then((res) => {
        if (res.data.error === '') {
          // Success
          this.setState({ btn: { text: 'Successful', appearance: 'mediumGreen' } });
          this.props.onClose()
        }
      })
      .catch((res) => {
        alert(res.data.error)
        this.setState({ btn: { text: 'Try Again', appearance: 'mediumRed' } });
        console.log(res);
      });
  }

  render() {
    return (
      <Modal
        title='Signup'
        onClose={this.props.onClose}>
        <p> Join over 1000 people like you that want to SAY freely. Fill out the form to be joined:</p>
        <form onSubmit={this.handleSubmit}>
          <Input
            placeholder='Choose a Username'
            type='text'
            value={this.state.username}
            onChange={this.handleUsernameChange} />
          <Input
            placeholder='The Secret Password'
            type='password'
            value={this.state.password}
            onChange={this.handlePasswordChange} />
          <Input
            placeholder='Say Your Fullname'
            type='text'
            value={this.state.fullname}
            onChange={this.handleFullnameChange} />
          <Input
            placeholder='Email'
            type='text'
            value={this.state.email}
            onChange={this.handleEmailChange} />

          <div style={{ textAlign: 'center' }}>
            <img
              src={this.state.avatar.preview}
              style={{ maxWidth: '100%', display: 'inline-block', marginBottom: 7 }} />
          </div>

          <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} accept='image/*'
            style={{
              width: '100%',
              height: '50px',
              padding: 15,
              marginBottom: 10,
              textAlign: 'center',
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Arvo, serif',
              border: '2px dashed #999'
            }}>
            <div>Drop your profile photo or choose. > 70px is recommended</div>
          </Dropzone>

          <p style={{ textAlign: 'center', color: 'rgb(207, 73, 24)' }}>
            {this.state.error}
          </p>

          <div style={{ textAlign: 'center' }}>
            <Button appearance={this.state.btn.appearance}>{this.state.btn.text}</Button>
          </div>

        </form>
      </Modal>
    );
  }
}
