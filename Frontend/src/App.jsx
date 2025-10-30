import React, {useEffect, useState} from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import axios, {all, Axios} from "axios"
import home from "./home"
import profile from "./profile"
import './App.css'

function App() { 
  const [islogin, setislogin] = useState()
  const [id, setid] = useState()
  const [perfil, setperfil] = useState()

  useEffect(() => {
    const thema = localStorage.getItem("theme") 
    document.documentElement.setAttribute("data-theme", thema)
    const login = localStorage.getItem("islogin")
    const testar = async () => {
      if(login == null){
        setislogin(false)
      }else{
        setid(localStorage.getItem("id"))
        setislogin(true)
      }
      if(thema == "light"){
        document.getElementById("1").innerText = "dark"
        console.log(perfil)
      }if(thema == "dark"){
        document.getElementById("1").innerText = "light"
      }
    };testar();
    const todascontas = () => {
      const data = {
        idendficação: localStorage.getItem("idendificação")
      }
        axios.post("https://chattr-16i4.onrender.com/api/getcontas", data)
          .then(Response => {
            console.log(Response.data[0][2])
            setperfil(Response.data[0][2])
          })
          .catch(erro => {
            console.log(erro)
          })
    };todascontas()
  }, []);
  const mudarloginoucadrasto = (e) => {
    if(e.target.id == "login.button"){
      document.getElementById("login").hidden = true
      document.getElementById("cadrasto").hidden = false
      console.log("test")
    }else{
      document.getElementById("cadrasto").hidden = true
      document.getElementById("login").hidden = false
      console.log("test2")
    }
  }
  const mudarthema = () => {
    localStorage.setItem("theme", document.getElementById("1").innerText)
    document.documentElement.setAttribute("data-theme", localStorage.getItem("theme"))
    if(document.getElementById("1").innerText == "light"){
      document.getElementById("1").innerText = "dark"
    }else{
      document.getElementById("1").innerText = "light"
    }
  }
  const certeza = (e) => {
    if(e.target.id == "23"){
      const data ={
        nome: document.getElementById("login.user").value,
        senha: document.getElementById("login.password").value
      }
      axios.post("https://chattr-16i4.onrender.com/api/login", data)
        .then((Response) => {
          if(Response.data == "usuario não achado"){
            console.log("deu erro")
          }else{
            console.log(Response.data)
            localStorage.setItem("idendificação", Response.data.indentificação)
            localStorage.setItem("id", Response.data.id)
            localStorage.setItem("islogin", true)
            setid(Response.data.id)
            location.reload()
          }
        })
        .catch(erro => {
          console.log(erro)
        });
        
    }else{  
      const data ={
        nome: document.getElementById("cadrasto.user").value,
        senha: document.getElementById("cadrasto.password").value
      }
      axios.post("https://chattr-16i4.onrender.com/api/cadrasto", data)
        .then((Response) => {
          if(Response.data == "usuario ja existe"){
            console.log("deu erro")
          }else{
            localStorage.setItem("idendificação", Response.data.indentificação)
            localStorage.setItem("id", Response.data.id)
            setid(Response.data.id)
            localStorage.setItem("islogin", true)
            location.reload()
          }
        })
        .catch(erro => {
          console.log(erro)
        });
    }
  }

  return (
    <>
    <div>
      {islogin ? (<BrowserRouter> 
        <nav className='dark:bg-black border-2 bg-white border-black dark:border-white white flex justify-between items-center p-2'>
          <div>
            <Link className='justify-self-start' to={"/"}>
              <img className='sm:w-10 w-8 rounded-full transition duration-300 ease-in-out hover:border-4 hover:border-purple-500' src="/chat_messages_14395.png"/>
            </Link>
          </div>
          <div>
            <img onClick={() => {document.getElementById("menu").hidden = false}} className='rounded-full sm:w-10 w-8 transition duration-300 ease-in-out hover:border-4 hover:border-purple-500 cursor-pointer' src={"/"+perfil+".png"}/>
            <div className='absolute sm:right-1 sm:top-16 top-14 right-1 dark:bg-black border-2 bg-white border-black dark:border-white rounded-lg p-1 flex flex-col justify-center items-center' id='menu' hidden>
              <p className='p-2 cursor-pointer transition duration-300 ease-in-out hover:border-purple-500 hover:border-1' onClick={() => {localStorage.clear(all) && location.reload(true)}}>Sair</p>
              <Link to={"/profile/"+id}>
                <p className='p-2 cursor-pointer transition duration-300 ease-in-out hover:border-purple-500 hover:border-1' onClick={() => {location.replace("/profile/"+id)}}>Perfil</p>
              </Link>
            </div>
          </div>  
        </nav>
        <Routes>
          <Route path='/' Component={home}/>
          <Route path={"/profile/" + id} Component={profile}/>
        </Routes>
      </BrowserRouter>):(
        <div className='flex flex-col h-screen items-center justify-center'>
          <div className='dark:bg-black dark:border-white border-2 bg-white border-black rounded-xl p-4' id="login">
            <h1>Login</h1>
            <p>Usuario</p>
            <input type="text" id="login.user" enterKeyHint={certeza}/>
            <p>Senha</p>
            <input type="password" id="login.password" enterKeyHint={certeza}/> <br />
            <button id='23' type="submit" onClick={certeza}>Enviar</button>
            <p className='max-w-28'>Se vocẽ não tiver uma conta, aperte o link abaixo</p>
            <button className='text-blue-500' onClick={mudarloginoucadrasto} id='login.button'>cadrastar</button>
          </div>
          <div className='flex flex-col h-screen items-center justify-center' id="cadrasto" hidden>
            <div className='dark:bg-black dark:border-white border-2 bg-white border-black rounded-xl p-4' id="cadrasto.2">
              <h1>cadrasto</h1>
              <p>Usuario</p>
              <input type="text" id="cadrasto.user" enterKeyHint={certeza}/> 
              <p>Senha</p>
              <input type="password" id="cadrasto.password" enterKeyHint={certeza}/> 
              <p>Senha de confirmação</p>
              <input type="password" enterKeyHint={certeza}/><br />
              <button id='32' type="submit" onClick={certeza}>Enviar</button>
              <p className='max-w-28'>Se vocẽ tiver uma conta, aperte o link abaixo</p> 
              <button className='text-blue-500' onClick={mudarloginoucadrasto} id='cadrasto.button'>logar</button>
            </div>
          </div>
        </div>
      )}
      <button id="1" className="m-5 p-3 rounded-xl text-white bg-gray-700 fixed right-0 bottom-0 cursor-pointer transition duration-300 ease-in-out hover:border-purple-500 hover:border-4 hover:-translate-y-0.5" onClick={mudarthema}>
        dark
      </button>
    </div>
    </>
  )
}

export default App