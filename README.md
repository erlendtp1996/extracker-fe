## ExTracker

This is a front end [React](https://github.com/facebook/create-react-app) application is designed to log exercises and routines that one may perform ( at the gym, after work, etc.). By integrating [Auth0](https://auth0.com/) different users are able to submit exercises and routines to a Spring api. 

Exercises: {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;exerciseId [Number],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;name [String],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;description [String]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;userId [String]</br>
} <br/>
Routines: {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;routineId [Number],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;exerciseId [Number],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;weight [Number],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;setsPerformed [Number],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;restInterval [String],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;date [Date],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;notes [String],<br/>
}

## Launching application

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Contributing

This is a application to help myself learn (as well as use at the gym) and would be appreciative of any contributers.
