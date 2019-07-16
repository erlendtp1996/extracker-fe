import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import axios from 'axios';
import auth0Client from '../Auth';
import Moment from 'react-moment';
import moment from 'moment';

const loadingDiv = {
  padding: '100px'
}
const loadingCss = {
  margin: 'auto'
}

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;

class Routine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseId: props.match.params.id,
      routines: [],
      user_id: auth0Client.isAuthenticated() ? auth0Client.getProfile().sub.split('|')[1] : null,
      loading: true,
      updateable: false,
      routineId: '',
      weight: '',
      sets: '',
      reps: '',
      rest: '',
      date: '',
      notes: ''
    };

    this.handleWeight = this.handleWeight.bind(this);
    this.handleSets = this.handleSets.bind(this);
    this.handleReps = this.handleReps.bind(this);
    this.handleRest = this.handleRest.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  async componentDidMount() {
    if (auth0Client.isAuthenticated()) {
      const exerciseId = this.state.exerciseId;
      var routines = [];
      try {
        routines = await axios.get(API_DOMAIN + '/api/routines?exerciseId=' + exerciseId, {
          headers: {
            'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
            crossDomain: true
          }
        });
        this.setState({ routines: routines.data, loading: false, updateable: false });
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  handleWeight(event) {
    this.setState({ weight: event.target.value });
  }
  handleSets(event) {
    this.setState({ sets: event.target.value });
  }
  handleReps(event) {
    this.setState({ reps: event.target.value });
  }
  handleRest(event) {
    this.setState({ rest: event.target.value });
  }
  handleDate(event) {
    this.setState({ sets: moment.utc(event.target.value).startOf('day') });
  }
  handleNotes(event) {
    this.setState({ notes: event.target.value });
  }
  async handleSubmit(event) {
    event.preventDefault();
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }

    var postRoutine = {
      exerciseId: this.state.exerciseId,
      weight: this.state.weight,
      setsPerformed: this.state.sets,
      repsPerformed: this.state.reps,
      restInterval: this.state.rest,
      date: this.state.date,
      notes: this.state.notes
    }

    if (this.state.updateable) {
      postRoutine.routineId = this.state.routineId;
    }

    this.setState({ loading: true });
    const url = this.state.updateable ? API_DOMAIN + '/api/routines/' + this.state.routineId : API_DOMAIN + '/api/routines';

    await axios.post(url, postRoutine, { headers: headers });
    var routines = await axios.get(API_DOMAIN + '/api/routines?exerciseId=' + this.state.exerciseId, { headers: headers });
    this.setState({
      routines: routines.data,
      loading: false,
      updateable: false,
      routineId: '',
      weight: '',
      sets: '',
      reps: '',
      rest: '',
      date: '',
      notes: ''
    });
  }

  async handleDelete(id) {
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }

    this.setState({ loading: true });

    await axios.delete(API_DOMAIN + '/api/routines/' + id, {}, { headers: headers });
    var routines = await axios.get(API_DOMAIN + '/api/routines?exerciseId=' + this.state.exerciseId, { headers: headers });
    this.setState({ routines: routines.data, loading: false, updateable: false });
  }

  handleUpdate(event, routine) {
    this.setState({
      updateable: event.target.checked,
      routineId: routine.routineId || '',
      weight: routine.weight || '',
      sets: routine.setsPerformed || '',
      reps: routine.repsPerformed || '',
      rest: routine.restInterval || '',
      date: moment.utc(routine.date).format('YYYY-MM-DD') || '',
      notes: routine.notes || ''
    })
  }

  render() {
    return (
      <div className="container">
        { !auth0Client.isAuthenticated() && <div className="row"><p>Please sign in to add/view routines.</p></div> }
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
        { (auth0Client.isAuthenticated() && !this.state.loading) &&
          <div className="row">
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Add Routines</h5>
                <form onSubmit={this.handleSubmit} className="form-group">
                  <div className="row">
                    <div className="col">
                      <label>
                        Weight (lbs):
                        <input type="number" onChange={this.handleWeight} className="form-control" value={this.state.weight}/>
                      </label>
                    </div>
                    <div className="col">
                      <label>
                        Sets:
                        <input type="number" onChange={this.handleSets} className="form-control" value={this.state.sets}/>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>
                        Reps:
                        <input type="number" onChange={this.handleReps} className="form-control" value={this.state.reps}/>
                      </label>
                    </div>
                    <div className="col">
                      <label>
                        Rest Interval:
                        <input type="text" onChange={this.handleRest} className="form-control" value={this.state.rest}/>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>
                        Date:
                        <input type="date" onChange={this.handleDate} className="form-control" value={this.state.date}/>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col">
                        <label>
                          Additional Notes:
                          <textarea onChange={this.handleNotes} className="form-control" value={this.state.notes}/>
                        </label>
                      </div>
                    </div>
                  </div>
                  <input type="submit" value={this.state.updateable ? "Update" : "Submit"} />
                </form>
              </div>
            </div>
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Routines</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Date</th>
                      <th>Weight (lbs)</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.routines && this.state.routines.map(routine => (
                    <tr key={routine.routineId}>
                      <td>
                        <input name="updateable" type="radio" onChange={(event) => this.handleUpdate(event, routine)} checked={(this.state.updateable && this.state.routineId === routine.routineId)} />
                      </td>
                      <td>
                        { routine.date ?
                        <Moment format="MM/DD" add={{ days: 1 }}>
                            {routine.date}
                        </Moment>
                          : "--"}
                      </td>
                      <td>{routine.weight ? routine.weight : "--"}</td>
                      <td>{routine.setsPerformed ? routine.setsPerformed : "--"}</td>
                      <td>{routine.repsPerformed}</td>
                      <td><button onClick={() => this.handleDelete(routine.routineId)}>Delete</button></td>
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

export default Routine;
