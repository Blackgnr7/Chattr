import {useEffect, useState} from "react"
import axios, { Axios } from "axios"

function Home(){
    const [perfil, setperfil] = useState()

    useEffect(() => {
        document.getElementById("enviarmensagem").disabled = true
        const intervalId = setInterval(todas, 5000);
        const todascontas = () => {
            const data = {
                idendficação: localStorage.getItem("idendificação")
            }
            axios.post("/api/getcontas", data)
                .then(Response => {
                    setperfil(Response.data[0][2])
                })
                .catch(erro => {
                    console.log(erro)
                })
        };todascontas()
        return () => clearInterval(intervalId);
    }, []);
    const escrever = () =>{
        const enviar = document.getElementById("colocaresquever")
        enviar.innerText = ""
    }
    const todas = () => {
        axios.get("/api/recebermensagem")
        .then(Response => {
            let i = 0
            document.querySelectorAll("#exemple ~ div").forEach(e => e.remove());
            while(true){
                if(Response.data[i] == undefined){
                    break
                }else{
                    if(i==50){
                        break
                    }else{
                        const div = document.createElement("div")
                        div.className = "p-5"
                        div.innerHTML = `<div class="flex justify-normal">
                            <img src="/`+Response.data[i].fotodeperfil+`.png" width="64px" height="64px" class="mr-5 mb-5 rounded-full"/>
                            <p class="text-gray-500">`+Response.data[i].nome+`</p><p class="text-emerald-600 ml-2">`+Response.data[i].usuario_id+`</p>
                        </div>
                        <div class="sm:max-w-96 max-w-52">  
                            <span class="dark:text-white text-black max-w-60 text-justify">`+Response.data[i].mensagem+`</span>
                        </div>`
                        document.getElementById("exemple").after(div)
                    i++
                    }
                }
            }
        })
        .catch(erro => {
            console.log(erro)
        })
    };
    const colocaresqueverid = () =>{
        let pode = false
        const botão = document.getElementById("enviarmensagem")
        const enviar = document.getElementById("colocaresquever")
        if(enviar.innerText.length > 1 && pode == false){
            botão.disabled = false
        }if(enviar.innerText.length < 2){
            botão.disabled = true
        }if(enviar.innerText.length > 149){
            pode = true
        }if(enviar.innerText.length < 150){
            pode = false
        }
        if(pode == true){
            botão.disabled = true
        }
    }
    const enviar = () =>{
        console.log("enviado")
        const data = {
            idendificação: localStorage.getItem("idendificação"),
            mensagem: document.getElementById("colocaresquever").innerText
        }
        axios.post("/api/enviar-mesnsagem", data)
            .then((Response) => {
                console.log(Response.data)
            })
            .catch(erro => {
                console.log(erro)
            })
        for (let index = 0; index < 51; index++) {
            if(index == 50){
                todas()
            }else{
                continue    
            }
        }
    }
    return(
        <>
        <div className="h-full border-2 dark:bg-black dark:border-white bg-white border-black justify-self-center m-6 md:ml-44 md:mr-44">
            <div className="border-2">
                <div id="Comentar" className="flex justify-normal p-5">
                    <div className="pr-9">
                        <img src={"/"+perfil+".png"} className="rounded-full" width="64px" height="64px"/>
                    </div>
                    <div className="sm:max-w-96 max-w-52">  
                        <span onKeyDown={colocaresqueverid} onBlur={() => {if(document.getElementById("colocaresquever").innerText == ""){document.getElementById("colocaresquever").innerText = "O que queres falar?"}}} onFocus={escrever} contentEditable="true" id="colocaresquever" className="dark:text-white text-black cursor-pointer sm:max-w-96 max-w-48 p-2">O que queres falar?</span>
                    </div>
                </div>
                <div className="justify-self-end">
                    <button id="enviarmensagem" className="p-2 rounded-2xl bg-green-700 m-3 disabled:bg-red-600 hover:cursor-pointer" onClick={enviar}>Enviar</button>
                </div>  
            </div>
            <div id="exemple" className="p-5" hidden>
                <div className="flex justify-normal">
                    <img src={"/"+perfil+".png"} width="64px" height="64px" className="mr-5 mb-5 rounded-full"/>
                    <p className="text-gray-500">exemple nome</p>
                </div>
                <div className="sm:max-w-96 max-w-52">  
                    <span className="dark:text-white text-black max-w-60 text-justify">Seu texto aqui que é muito longo e precisa ser controlado</span>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home