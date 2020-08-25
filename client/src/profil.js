import React, {Component} from 'react';
import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import './App.css';
import Axios from "axios";
import axios from "axios";
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';


class Profil extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isSignedUp: true,
            titre: '',
            description: '',
        }
    }
    cookies = new Cookies();

    mySubmitHandler = (event) => {
        event.preventDefault()
        axios({
            method: 'POST',
            url: 'http://localhost:4000/user/billet/create',
            data: {
                titre: this.state.titre,
                description: this.state.description
            }
        }).then((response)=>{
            if (response.status === 200) {
                alert('Le billet est bien enregistré')
            } else if(response.status === 400) {
                alert('Erreur dans la création du billet')
            }
        })
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        if (!this.cookies.get('Connected')) {
            this.setState({ isSignedUp: false });
        }
        if (this.state.isSignedUp === false) {
            return <Redirect to = {{ pathname: "/" }} />;
        }
        return (
            <div>
                <h2>Profil</h2>
                <h5>Créer un billet</h5>
                <form onSubmit={this.mySubmitHandler} method='POST' action='/billet/create'>
                    <input name="titre" type="text" placeholder="Titre" onChange={this.myChangeHandler} />
                    <input name="description" type="text" placeholder="Contenu" onChange={this.myChangeHandler} />
                    <input name="submit" type="submit" value="Créer le billet" onChange={this.myChangeHandler} />
                </form>
            </div>
        )
    }
}

export default Profil;