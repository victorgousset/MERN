import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import './App.css';
import axios from "axios";
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';
import Profil from './profil'

class App extends Component {
    /* state = { users: [] }

     componentDidMount() {
         fetch('/users')
             .then(res => res.json())
             .then(users => this.setState({ users }));

                               {this.state.users.map(user =>
                   <li key={user.id}>{user.username}</li>)}
     }*/

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                            <li>
                                <Link to="/profil">Profil</Link>
                            </li>
                        </ul>

                        <hr />

                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route path="/login">
                                <Login />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                            <Route path="/profil">
                                <Profil />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

class Home extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isSignedUp: false,
        }
    }
    cookies = new Cookies();

    render() {
        return (
            <div>
                <h2>Home</h2>
            </div>
        )
    }
}

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            isSignedUp: false,
        };
    }
    cookies = new Cookies();

    mySubmitHandlerLogin = (event) => {
        event.preventDefault()
        axios({
            method: 'POST',
            url: 'http://localhost:4000/user/login',
            data: {
                login: this.state.login,
                password: this.state.password
            }
        }).then((response)=>{
            if (response.status === 200){
                this.cookies.set('Connected')
                this.setState({ isSignedUp: true });
            }
        })
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        if (this.cookies.get('Connected')) {
            this.setState({ isSignedUp: true });
        }
        if (this.state.isSignedUp) {
            return <Redirect to = {{ pathname: "/" }} />;
        }
        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={this.mySubmitHandlerLogin} method='POST' action='/login'>
                    <input name="login" type="text" placeholder="login" onChange={this.myChangeHandler} />
                    <input name="password" type="password" placeholder="password" onChange={this.myChangeHandler} />
                    <input name="submit" type="submit" value="Se connecter" onChange={this.myChangeHandler} />
                </form>
            </div>
        )
    }

}

class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            email: '',
            password: '',
            isSignedUp: false,
        };
    }
    cookies = new Cookies();

    mySubmitHandler = (event) => {
        event.preventDefault();
        //console.log(this.state.login)

        axios({
            method: "POST",
            url:"http://localhost:4000/user/create",
            data: {
                login: this.state.login,
                email: this.state.email,
                password: this.state.password
            }
        }).then((response)=>{
            if (response.status === 400){
                alert("Tous les champs ne sont pas remplis");
            }else if(response.status === 200){
                alert("Tu es bien inscrit")
            }else if(response.data.msg === 'loginExist'){
                alert("Ce login est déjà utilisé")
            }
        })

        /*axios.post(`http://localhost:4000/user/create`)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })*/
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        if (this.cookies.get('Connected')) {
            this.setState({ isSignedUp: true });
        }
        if (this.state.isSignedUp) {
            return <Redirect to = {{ pathname: "/" }} />;
        }
        return (
            <div>
                <h1>Hello {this.state.login} {this.state.email} {this.state.password}</h1>
                <h3>Register</h3>
                <form onSubmit={this.mySubmitHandler} method='POST' action='/create'>
                    <input name="login" type="text" placeholder="login" onChange={this.myChangeHandler} />
                    <input name="email" type="email" placeholder="Email" onChange={this.myChangeHandler} />
                    <input name="password" type="password" placeholder="password" onChange={this.myChangeHandler}/>
                    <input name="password_confirm" type="password" placeholder="password_confirm"/>
                    <input name="submit" type="submit" value="S'inscrire"/>
                </form>
            </div>
        );
    }
}

export default App;
