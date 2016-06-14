import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './App.css'
import axios from 'axios'
import Account from '../../utils/account'

import Container from '../Container/Container'
import Header from '../Header/Header'
import SayingList from '../SayingList/SayingList'
import Footer from '../Footer/Footer'
import LoginModal from '../../containers/LoginModal/LoginModal'
import SignupModal from '../../containers/SignupModal/SignupModal'
import SayModal from '../../containers/SayModal/SayModal'
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react'

@CSSModules(styles)
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      sayingList: [],
      logoutTime: 0,
      showLogin: false,
      showSignup: false,
      showSay: false
    }
  }

  showLogin() { this.setState({ showLogin: true }) }
  hideLogin() { this.setState({ showLogin: false }) }

  showSignup() { this.setState({ showSignup: true }) }
  hideSignup() { this.setState({ showSignup: false }) }

  showSay() { this.setState({ showSay: true }) }
  hideSay() { this.setState({ showSay: false }) }

  doLogout() {
    this.setState({ logoutTime: Date.now() })
    Account.logout()
  }

  loadData() {
    return new Promise((resolve, reject) => {
      let headers = {}
      if(Account.isLoggedIn()) {
        headers = { authorization: Account.getToken() }
      }
      axios.get('http://localhost:3000/sayings', {}, headers).then((res) => {
        resolve(res.data)
      })
      .catch((res) => {
        reject(new Error(res.error || res || ''))
      })
    })
  }

  onSaySuccess() {
    this.loadData()
      .then((data) => {
        this.setState({ sayingList: data })
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  componentDidMount() {
    this.loadData()
      .then((data) => {
        this.setState({ sayingList: data })
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  render() {
    return (
      <div>
        <Container>
          <Header
            onLoginClick={this.showLogin.bind(this)}
            onLogoutClick={this.doLogout.bind(this)}
            onSignupClick={this.showSignup.bind(this)}
            onSayClick={this.showSay.bind(this)} />

          <SayingList data={this.state.sayingList} />

          <Footer />

          <VelocityComponent animation={ this.state.showLogin ? 'fadeIn' : 'fadeOut' } duration={200}>
            <LoginModal onClose={this.hideLogin.bind(this)} />
          </VelocityComponent>

          <VelocityComponent animation={ this.state.showSignup ? 'fadeIn' : 'fadeOut' } duration={200}>
            <SignupModal onClose={this.hideSignup.bind(this)} />
          </VelocityComponent>

          <VelocityComponent animation={ this.state.showSay ? 'fadeIn' : 'fadeOut' } duration={200}>
            <SayModal onClose={this.hideSay.bind(this)} onSuccess={this.onSaySuccess.bind(this)} />
          </VelocityComponent>

        </Container>
      </div>
    )
  }
}
