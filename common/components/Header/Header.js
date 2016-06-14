import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './Header.css'
import Account from '../../utils/account'

import Logo from '../Logo/Logo'
import Button from '../Button/Button'

@CSSModules(styles)
export default class Header extends Component {

  renderButtons() {
    if (Account.isLoggedIn()) {
      return (
        <div>
          <Button
            appearance="mediumBlack"
            style={{
              float: 'right'
            }}
            onClick={this.props.onSayClick}>
            <span className="oi" data-glyph="plus"></span>&nbsp;&nbsp;
            Say Your Mind
          </Button>
          <Button
            appearance="mediumRed"
            style={{
              float: 'right',
              marginRight: 10
            }}
            onClick={this.props.onLogoutClick}>
            <span className="oi" data-glyph="account-logout"></span>&nbsp;&nbsp;
            Logout
          </Button>
        </div>
        );
    } else {
      return (
        <div>
          <Button
            appearance="mediumBlack"
            style={{
              float: 'right'
            }}
            onClick={this.props.onLoginClick}>
            <span className="oi" data-glyph="account-login"></span>&nbsp;&nbsp;
            Login
          </Button>
          <Button
            appearance="mediumBlack"
            style={{
              float: 'right',
              marginRight: 10
            }}
            onClick={this.props.onSignupClick}>
            <span className="oi" data-glyph="bolt"></span>&nbsp;&nbsp;
            Signup
          </Button>
        </div>
      );
    }
  }

  render() {
    return (
      <div styleName='header'>
        <Logo style={{ float: 'left' }} />
        {this.renderButtons()}
      </div>
    );
  }
}
