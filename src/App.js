import React, { Component } from 'react';
import {reduxForm, Field} from 'redux-form';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Delivery Complaint</h1>
        </header>
        <form onSubmit={this.props.handleSubmit(values => console.log(values))}>
          <div>
            <label value="Tracking number">Tracking number</label>
            <Field component="input" name="trackingNumber"/>
          </div>
          <div>
            <label htmlFor="issue">What is your issue?</label>
            <Field component="select" name="issue" id="issue">
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
  form: 'complaint'
})(App);
