import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import auth0Client from '../Auth';
import Moment from 'react-moment';
import moment from 'moment';

var weight = null;
var sets = null;
var reps = null;
var rest = null;
var date = null;
var notes = null;

class Routine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseId: props.match.params.id,
      routines: [],
      user_id: auth0Client.isAuthenticated() ? auth0Client.getProfile().sub.split('|')[1] : null,
    };

    this.handleWeight = this.handleWeight.bind(this);
    this.handleSets = this.handleSets.bind(this);
    this.handleReps = this.handleReps.bind(this);
    this.handleRest = this.handleRest.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleNotes = this.handleNotes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    if (auth0Client.isAuthenticated()) {
      const exerciseId = this.state.exerciseId;
      var routines = [];
      try {
        routines = await axios.get('https://extracker-api.herokuapp.com/api/routines?exerciseId=' + exerciseId, {
          headers: {
            'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
            crossDomain: true
          }
        });
        console.log(routines);
        this.setState({ routines: routines.data });
      } catch (exception) {
        console.log(exception);
      }
    }
  }

  handleWeight(event) {
    weight = event.target.value;
  }
  handleSets(event) {
    sets = event.target.value;
  }
  handleReps(event) {
    reps = event.target.value;
  }
  handleRest(event) {
    rest = event.target.value;
  }
  handleDate(event) {
    date = moment.utc(event.target.value).startOf('day');
  }
  handleNotes(event) {
    notes = event.target.value;
  }
  async handleSubmit(event) {
    event.preventDefault();
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }

    console.log(date);

    await axios.post('https://extracker-api.herokuapp.com/api/routines', {
      exerciseId: this.state.exerciseId,
      weight: weight,
      setsPerformed: sets,
      repsPerformed: reps,
      restInterval: rest,
      date: date,
      notes: notes
    }, {
      headers: headers
    });

    var routines = await axios.get('https://extracker-api.herokuapp.com/api/routines?exerciseId=' + this.state.exerciseId, { headers: headers });

    console.log(routines);
    this.setState({ routines: routines.data });
  }

  async handleDelete(id) {
    const userId = this.state.user_id;
    const headers = {
      'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
      crossDomain: true
    }

    await axios.delete('https://extracker-api.herokuapp.com/api/routines/' + id, {}, {
      headers: headers
    });

    var routines = await axios.get('https://extracker-api.herokuapp.com/api/routines?exerciseId=' + this.state.exerciseId, {
      headers: {
        'Authorization': `Bearer ${auth0Client.getAccessToken()}`,
        crossDomain: true
      }
    });
    this.setState({ routines: routines.data });
  }

  render() {
    return (
      <div className="container">
        { !auth0Client.isAuthenticated() && <div className="row"><p>Please sign in to add/view routines.</p></div> }
        { auth0Client.isAuthenticated() &&
          <div className="row">
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Add Routines</h5>
                <form onSubmit={this.handleSubmit} className="form-group">
                  <div className="row">
                    <div className="col">
                      <label>
                        Weight (lbs):
                        <input type="number" onChange={this.handleWeight} className="form-control"/>
                      </label>
                    </div>
                    <div className="col">
                      <label>
                        Sets:
                        <input type="number" onChange={this.handleSets} className="form-control"/>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>
                        Reps:
                        <input type="number" onChange={this.handleReps} className="form-control"/>
                      </label>
                    </div>
                    <div className="col">
                      <label>
                        Rest Interval:
                        <input type="text" onChange={this.handleRest} className="form-control"/>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <label>
                        Date:
                        <input type="date" onChange={this.handleDate} className="form-control"/>
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col">
                        <label>
                          Additional Notes:
                          <textarea onChange={this.handleNotes} className="form-control" />
                        </label>
                      </div>
                    </div>
                  </div>
                  <input type="submit" value="Submit" />
                </form>
              </div>
            </div>
            <div className="card" className="displayCard">
              <div className="card-body">
                <h5 className="card-title">Routines</h5>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight (lbs)</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.routines && this.state.routines.map(routine => (
                    <tr>
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
