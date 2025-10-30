import { useEffect, useState } from "react"
import axios, {} from "axios"

function Profile(){
    const [perfil, setperfil] = useState()

    useEffect(() => {
        document.getElementById("enviar").disabled = true
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
    }, []);

    const motrarimagem = (e) => {
        const imagem = e.target.files[0]
        const imagempreview = document.getElementById("imagempreview")
        document.getElementById("enviar").disabled = false
        imagempreview.src = URL.createObjectURL(imagem)
    }
    const enviar = () => {
        const imagem = document.getElementById("imageminpout").files[0]
        const nometrocar = document.getElementById("name").value
        const data = new FormData()
        data.append("imagem", imagem)
        data.append("idendficação", localStorage.getItem("idendificação"))
        data.append("nome", nometrocar)
        console.log(data)
        axios.post("/api/enviar-imagem", data, {headers: {'Content-Type': 'multipart/form-data'}})
            .then(Response => {
                if(Response.data == "imagem recebida"){
                    window.location.reload()
                }
            })
            .catch(erro => {
                console.log(erro)
            })
    }
    return(
        <div className="flex items-center justify-center flex-col">
            <div className="border-2 dark:border-white border-black p-7 text-white dark:text-white bg-black flex flex-col items-center">
                <h1 className="text-4xl">Profile</h1>
                <p>icone do perfil</p>
                <input id="imageminpout" onChange={motrarimagem} type="file" accept="image/png, image/jpeg" className="cursor-pointer"/>
                <img id="imagempreview" src={"/"+perfil+".png"} alt="" className="rounded-full" width="128"/>
                <p>nome</p>
                <input id="name" type="text" className="p-3 border-2 rounded-2xl" maxLength="18" onChange={() =>{if(document.getElementById("name").value.length > 3){document.getElementById("enviar").disabled = false}else{document.getElementById("enviar").disabled = true}}}/>
                <button className="cursor-pointer border-2 p-2 mt-3 transition duration-300 ease-in-out hover:bg-green-600 disabled:hover:bg-red-600 rounded-2xl" onClick={enviar} id="enviar">Enviar</button>
            </div>  
        </div>
    )
}
export default Profile