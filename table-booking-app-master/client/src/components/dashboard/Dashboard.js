import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      available_tables: null,
      booked_tables: null,
      errors: {},
    };
  }

  componentDidMount = () => {
    this.getAvailableTables();
    this.getBookingDetails();
  };
  getBookingDetails = () => {
    const body = {
      id: this.props.auth.user.id,
    };
    Axios.post("/api/users/getBookingdetails", body)
      .then((res) => {
        this.setState({ booked_tables: res.data });
      })
      .catch((err) => console.log(err));
  };
  getAvailableTables = () => {
    Axios.get("api/users/getTables")
      .then((res) => {
        console.log(res);
        this.setState({ available_tables: res.data });
      })
      .catch((err) => console.log(err));
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  bookTable = (number, time, capacity) => {
    const body = {
      email: localStorage.getItem("email"),
      time: time,
      number: number,
      table: {
        number: number,
        capacity: capacity,
        time: time,
      },
    };
    Axios.post("api/users/requestTable", body).then((res) => {
      console.log(res);
      this.getAvailableTables();
      this.getBookingDetails();
    });
  };

  cancelTable = (number, time, capacity) => {
    const body = {
      email: localStorage.getItem("email"),
      time: time,
      number: number,
      table: {
        number: number,
        capacity: capacity,
        time: time,
      },
    };
    Axios.post("api/users/cancelTable", body).then((res) => {
      this.getAvailableTables();
      this.getBookingDetails();
      console.log(res);
    });
  };

  generateBookedCards = (tables) => {
    const cards = tables.map((table) => {
      if (table) {
        return (
          <div className="col s12 m6 xl4">
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <h5>Table Number : {table.number}</h5>

                <br></br>
                <button
                  className="btn-floating btn-large waves-effect waves-light"
                  onClick={() =>
                    this.cancelTable(table.number, table.time, table.capacity)
                  }
                >
                  <i className="material-icons">clear</i>
                </button>
              </div>
            </div>
          </div>
        );
      }
    });
    return cards;
  };

  generateAvailableCards = (tables) => {
    const cards = tables.map((table) => {
      return (
        <div className="row center-align">
          Time : {table.time} <br />
          Number of Availability : {table.available_tables.length}
          <br></br>
          {table.available_tables.map((current_table) => {
            console.log(current_table);
            return (
              <div className="col s12 m6 xl4">
                <div class="card blue-grey darken-1">
                  <div class="card-content white-text">
                    <h5>Table Number : {current_table.number}</h5>

                    <br></br>
                    <button
                      className="btn-floating btn-large waves-effect waves-light"
                      onClick={() =>
                        this.bookTable(
                          current_table.number,
                          current_table.time,
                          current_table.capacity
                        )
                      }
                    >
                      <i className="material-icons">add</i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    });
    console.log(tables);
    return cards;
  };

  render() {
    const { user } = this.props.auth;
    console.log(this.props);
    return (
      <div style={{ height: "75vh" }} className="container ">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into{" "}
                <span style={{ fontFamily: "monospace" }}>Table Booking </span>{" "}
                app 👏
                <br />
                Here You can find your Booked and Available Tables
              </p>
            </h4>
          </div>
        </div>
        <div className="center-align">
          <h5>Available Tables</h5>

          {this.state.available_tables &&
            this.generateAvailableCards(this.state.available_tables)}
        </div>
        <div className="row center-align">
          <h5>Booked Tables</h5>
          {this.state.booked_tables &&
            this.generateBookedCards(this.state.booked_tables)}
        </div>
        <div className="row center-align">
          <button
            className="waves-effect waves-light btn"
            onClick={(e) => this.onLogoutClick(e)}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  tables: state.tables,
});
export default connect(mapStateToProps, {
  logoutUser,
})(Dashboard);
