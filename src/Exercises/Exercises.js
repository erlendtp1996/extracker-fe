import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import axios from 'axios';
import auth0Client from '../Auth';

const loadingDiv = {
  padding: '100px'
}
const loadingCss = {
  margin: 'auto'
}

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

class Exercises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      user_id: auth0Client.isAuthenticated() ? auth0Client.getProfile().sub.split('|')[1] : null,
      loading: true,
      updateable: false,
      exerciseName: '',
      exerciseDescription: '',
      exerciseId: ''
    };

    this.handleName = this.handleName.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async componentDidMount() {
    if (auth0Client.isAuthenticated()) {
      const userId = this.state.user_id;
      var exercises = [];
      try {
        exercises = await axios.get(API_DOMAIN + '/api/exercises?userId=' + userId, {
          headers: {
            'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
            crossDomain: true
          }
        });
        this.setState({ exercises: exercises.data, loading: false, updateable: false });
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  handleName(event) {
    this.setState({exerciseName: event.target.value});
  }

  handleDescription(event) {
    this.setState({exerciseDescription: event.target.value});
  }

  async handleDelete(id) {
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }

    this.setState({ loading: true });

    await axios.delete(API_DOMAIN + '/api/exercises/' + id, {}, {
      headers: headers
    });

    var exercises = await axios.get(API_DOMAIN + '/api/exercises?userId=' + userId, { headers: headers });
    this.setState({ exercises: exercises.data, loading: false, updateable: false  });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }
    var postExercise = {
      name: this.state.exerciseName,
      description: this.state.exerciseDescription,
      userId: userId,
    }

    if (this.state.updateable) {
      postExercise.exerciseId = this.state.exerciseId;
    }
this.setState({ loading: true });
    const url = this.state.updateable ? API_DOMAIN + '/api/exercises/' + this.state.exerciseId : API_DOMAIN + '/api/exercises'

    await axios.post(url, postExercise, { headers: headers });
    var exercises = await axios.get(API_DOMAIN + '/api/exercises?userId=' + userId, { headers: headers });
    this.setState({
      exercises: exercises.data,
      loading: false,
      updateable: false,
      exerciseName: '',
      exerciseDescription: '',
      exerciseId: ''
    });
  }

  handleUpdate(event, exercise) {
    this.setState({
      updateable: event.target.checked,
      exerciseName: exercise.name || '',
      exerciseDescription: exercise.description || '',
      exerciseId: exercise.exerciseId
    })
  }

  render() {
    return (
      <div className="container">
        { !auth0Client.isAuthenticated() && <div className="row"><p>Please sign in to add/view exercises.</p></div> }
        {
          (auth0Client.isAuthenticated() && this.state.loading) &&
          <div className="row" style={loadingDiv}>
            <SyncLoader
              css={loadingCss}
              sizeUnit={"px"}
              size={10}
              color={'#2C3E50'}
              loading={this.state.loading}
            />
          </div>
        }
        { (auth0Client.isAuthenticated() && !this.state.loading)
          &&
          <div className="row">
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Add Exercise</h5>
                <form onSubmit={this.handleSubmit} className="form-group">
                  <div className="row">
                    <div className="col">
                      <label>
                        Exercise Name:
                        <input type="text" onChange={this.handleName} className="form-control" value={this.state.exerciseName}/>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>
                        Exercise Description:
                        <textarea onChange={this.handleDescription} className="form-control" value={this.state.exerciseDescription}/>
                      </label>
                    </div>
                  </div>
                  <input type="submit" value={this.state.updateable ? "Update" : "Submit"} />
                </form>
              </div>
            </div>
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Exercises</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Description</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.exercises && this.state.exercises.map(exercise => (
                    <tr key={exercise.exerciseId} className="clickable-row">
                      <td>
                        <input name="updateable" type="radio" onChange={(event) => this.handleUpdate(event, exercise)} checked={(this.state.updateable && this.state.exerciseId === exercise.exerciseId)} />
                      </td>
                      <td><Link to={{pathname: '/exercises/' + exercise.exerciseId,
                            state: {
                              exerciseName: exercise.name,
                              exerciseDescription: exercise.description
                            }}}>{exercise.name}</Link></td>
                      <td>{exercise.description}</td>
                      <td><button onClick={() => this.handleDelete(exercise.exerciseId)}>Delete</button></td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Exercises;
