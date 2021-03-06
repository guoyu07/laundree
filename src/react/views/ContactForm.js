// @flow
import React from 'react'
import { ValidationForm, ValidationElement } from './validation'
import ValueUpdater from './helpers/ValueUpdater'
import sdk from '../../client/sdk'
import { FormattedMessage } from 'react-intl'
import { Input, Label, TextArea, Submit } from './intl'
import type { User, State } from 'laundree-sdk/lib/redux'
import type { LocaleType } from '../../locales/index'
import { connect } from 'react-redux'
import type { StateAddendum } from './types'
import ReactGA from 'react-ga'

const UserInput = ({user: {photo, displayName}}: { user: User }) => <div className='userInput'>
  <img className='avatar' src={photo} />
  <span className='name'>{displayName}</span>
</div>

type ContactFormValues = {
  name: string,
  subject: string,
  message: string,
  email: string
}
type ContactFormProps = { user: ?User, locale: LocaleType }
type ContactFormState = { loading: boolean, sent: boolean }

class ContactForm extends ValueUpdater<ContactFormValues, ContactFormProps, ContactFormState> {

  initialValues () {
    return {
      name: '',
      subject: '',
      message: '',
      email: ''
    }
  }

  initialState () {
    return {
      loading: false,
      sent: false
    }
  }

  onSubmit = (evt: Event) => {
    evt.preventDefault()
    this.submit()
  }

  async submit () {
    this.setState({loading: true})
    const {email, name, subject, message} = this.state.values
    if (this.props.user) {
      await sdk.api.contact.sendSupportMessage({message, subject, locale: this.props.locale})
      ReactGA.event({category: 'Support', action: 'Send message'})
    } else {
      await sdk.api.contact.sendMessage({name, email, message, subject, locale: this.props.locale})
      ReactGA.event({category: 'Contact', action: 'Send message'})
    }
    this.reset({loading: false, sent: true})
  }

  renderUser () {
    if (this.props.user) return <UserInput user={this.props.user} />
    return <ValidationElement sesh={this.state.sesh} value={this.state.values.name} nonEmpty trim>
      <Label data-validate-error='contact-form.error.no-name'>
        <Input
          readOnly={Boolean(this.props.user)}
          placeholder='general.name'
          type='text' value={this.state.values.name}
          onChange={this.generateValueEventUpdater((name: string) => ({name}))} />
      </Label>
    </ValidationElement>
  }

  renderEmail () {
    if (this.props.user) return null
    return <ValidationElement sesh={this.state.sesh} value={this.state.values.email} email trim>
      <Label data-validate-error='contact-form.error.invalid-email'>
        <Input
          readOnly={Boolean(this.props.user)}
          placeholder='general.email-address'
          type='text' value={this.state.values.email}
          onChange={this.generateValueEventUpdater((email: string) => ({email}))} />
      </Label>
    </ValidationElement>
  }

  renderSent () {
    return <div className='contactForm sent'>
      <FormattedMessage id={'contact-form.success'} />
    </div>
  }

  render () {
    if (this.state.sent) return this.renderSent()
    return <ValidationForm
      sesh={this.state.sesh} className={'contactForm' + (this.state.loading ? ' blur' : '')}
      onSubmit={this.onSubmit}>
      {this.renderUser()}
      {this.renderEmail()}
      <ValidationElement sesh={this.state.sesh} value={this.state.values.subject} nonEmpty trim>
        <Label data-validate-error='contact-form.error.no-subject'>
          <Input
            placeholder='general.subject'
            type='text'
            value={this.state.values.subject}
            onChange={this.generateValueEventUpdater(subject => ({subject}))} />
        </Label>
      </ValidationElement>
      <ValidationElement sesh={this.state.sesh} value={this.state.values.message} nonEmpty trim>
        <Label data-validate-error='contact-form.error.no-message'>
          <TextArea
            placeholder='general.message'
            value={this.state.values.message}
            onChange={this.generateValueEventUpdater(message => ({message}))} />
        </Label>
      </ValidationElement>
      <div className='buttons'>
        <Submit value='general.send' />
      </div>
    </ValidationForm>
  }
}

export default connect(({users, currentUser, config: {locale}}: State & StateAddendum): ContactFormProps => (
  {
    user: (currentUser && users[currentUser]) || null,
    locale
  }))(ContactForm)
