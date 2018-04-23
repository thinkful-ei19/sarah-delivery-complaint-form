import React, { Component } from 'react';
import {reduxForm, Field, SubmissionError, focus} from 'redux-form';
import Input from './components/input';
import {required, nonEmpty, lengthFive, numbers} from './validators';
import './App.css';

class ComplaintForm extends Component {
  onSubmit(values) {
    return fetch(' https://us-central1-delivery-form-api.cloudfunctions.net/api/report', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      // "trackingNumber": "01234", // This should be a string - leading zeros are allowed
      // "issue": "not-delivered", // One of "not-delivered", "wrong-item", "missing-part", "damaged", or "other"
      // "details": "It wasn't delivered" // Optional
        }
      })
        .then(res => {
          if(!res.ok) {
            if (
              res.headers.has('content-type') &&
              res.headers
                .get('content-type')
                .startsWith('application/json')
            ) {
              return res.json().then(err => Promise.reject(err));
            }

            return Promise.reject({
              code: res.status,
              message: res.statusText 
            });
          }
          return;
        })
        .then(() => console.log('Submitted with values', values))
        .catch(err => {
          const{reason, message, location} = err;
          if (reason === 'ValidationError') {
            return Promise.reject(
              new SubmissionError({
                [location]: message
              })
            );
          }
          return Promise.reject(
            new SubmissionError({
              _error: 'Error submitting message'
            })
          );
        });
  }
  render() {
    let successMessage;
    if (this.props.submitSucceeded) {
      successMessage = (
        <div className="message message-success">
        Message submitted successfully
    </div>
      );
    }

    let errorMessage;
        if (this.props.error) {
            errorMessage = (
                <div className="message message-error">{this.props.error}</div>
            );
        }

    // if (this.props.submitSucceeded) {
    //   return <div className="submitSuccess">Submit successful</div>;
    // }

    // if (this.props.error) {
    //   return <div className="submitSuccess">Submit successful</div>;
    // }

    return (
      <div className="complaintForm">
        <header className="App-header">
          <h1 className="App-title">Delivery Complaint</h1>
        </header>
        <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values)
          )}>
          {successMessage}
          {errorMessage}
          <div>
            <label value="Tracking number">Tracking number</label>
            <Field 
            component={Input}
            element="input" 
            name="trackingNumber"
            id="trackingNumber"
            validate={[required, nonEmpty, lengthFive, numbers]}
            />
          </div>
          <div>
            <label htmlFor="issue">What is your issue?</label>
            <Field 
            component={Input}
            element="select"
            name="issue" 
            id="issue"
            >
              <option value="not-delivered">My delivery hasn't arrived</option>
              <option value="wrong-item">The wrong item was delivered</option>
              <option value="missing-part">Part of my order was missing</option>
              <option value="damaged">Some of my order arrived damaged</option>
              <option value="other">Other (give details below)</option>
            </Field>
          </div>
          <div>
            <label htmlFor="details">Give more details (optional)</label>
            <Field component="input" name="details"/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'complaint',
  onSubmitFail: (errors, dispatch) =>
        dispatch(focus('complaint', Object.keys(errors)[0]))
})(ComplaintForm);
