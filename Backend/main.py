import flask
import sqlite3
import cryptography.fernet
import os
from flask_cors import CORS
from flask_socketio import SocketIO, emit

banco = sqlite3.connect("bancoprincipal.db", check_same_thread=False)

comando = banco.cursor()

key = cryptography.fernet.Fernet.generate_key()
f = cryptography.fernet.Fernet(key)
senhadoadmin = f.encrypt(b"admin")

comando.execute(
    '''
    CREATE TABLE IF NOT EXISTS usuario(
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        senha TEXT NOT NULL,
        Foto_de_perfil TEXT NOT NULL,
        indentificação TEXT NOT NULL
    )'''
)
comando.execute(
    '''
    CREATE TABLE IF NOT EXISTS mensagem(
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER,
        nome_de_usuario TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        foto_de_perfil TEXT NOT NULL,
        indetificação TEXT NOT NULL
        )
    '''
)

if comando.execute('SELECT * FROM usuario').fetchall() == []:
    comando.execute('INSERT INTO usuario (nome, senha, indentificação, Foto_de_perfil) VALUES (?, ?, ?, ?)', ('lying', 'gnr64puto1!', senhadoadmin.decode(), senhadoadmin.decode()))

banco.commit()   

app = flask.Flask(__name__)
socket = SocketIO(app, cors_allowed_origins="*")
CORS(app)

@socket.on("envio_mensagem")
def enviarão(data=None):
    print("enviado")
    emit("receber_mensagem", "enviarão_mensagem")

@socket.on("connect")
def connectdado():
    print({flask.request.sid})
    emit("server_response", {"data": f"id: `{flask.request.sid} conectado"})


@app.route('/')
def serve():
    return flask.send_from_directory(app.static_folder, 'index.html')

def handler(request):
    return app.wsgi_app(request.environ, request.start_response)

@app.route('/<path:path>')
def serve_static(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return flask.send_from_directory(app.static_folder, path)
    else:
        return flask.send_from_directory(app.static_folder, 'index.html')

@app.route('/api/login', methods=["POST"])
def login():
    data = flask.request.get_json()
    nome = data.get("nome")
    senha = data.get("senha")
    if(comando.execute('SELECT * FROM usuario WHERE nome = ? AND senha = ?', (nome, senha)).fetchall() != []):
        indentificação = comando.execute('SELECT indentificação FROM usuario WHERE nome = ? AND senha = ?', (nome, senha)).fetchall()  
        id = comando.execute('SELECT id FROM usuario WHERE nome = ? AND senha = ?', (nome, senha)).fetchall()  
        return {"indentificação": indentificação[0][0],"id": id[0][0]}
    else:
        return "usuario não achado"

@app.route('/api/cadrasto', methods=["GET", "POST"])
def cadrasto():
    if flask.request.method == "POST":
        data = flask.request.get_json()
        nome = data.get("nome")
        senha = data.get("senha")
        if(comando.execute('SELECT * FROM usuario WHERE nome = ?', (nome,)).fetchall() == []):
            while True:
                encriptar = os.urandom(16)
                encripta = f.encrypt(b"" + encriptar)
                if(comando.execute('SELECT * FROM usuario WHERE indentificação = ?', (encripta,)).fetchall() == []):
                    comando.execute('INSERT INTO usuario (nome, senha, indentificação) VALUES (?, ?, ?)', (nome, senha, encripta.decode()))
                    id = comando.execute('SELECT id FROM usuario WHERE nome = ? AND senha = ?', (nome, senha)).fetchall()
                    banco.commit()
                    return {"indentificação": encripta.decode(),"id": id[0][0]}
                else:
                    continue
        else:
            return "usuario ja existe"

@app.route('/api/enviar-mesnsagem', methods=["POST"])
def enviar_mesnsagem():
    data = flask.request.get_json()
    mensagem = data.get("mensagem")
    indentificação = data.get("idendificação")
    indentificação = indentificação
    if(comando.execute('SELECT * FROM usuario WHERE indentificação = ?', (indentificação,)).fetchall() != []):
        data = comando.execute('SELECT * FROM usuario WHERE indentificação = ?', (indentificação,)).fetchall()
        banco.commit()
        comando.execute('INSERT INTO mensagem (usuario_id, nome_de_usuario, mensagem, indetificação, foto_de_perfil) VALUES (?, ?, ?, ?, ?)', (data[0][0], data[0][1], mensagem, indentificação, data[0][3],))
        banco.commit()
        return "mensagem enviada"
    else:
        return "usuario não achado"

@app.route("/api/recebermensagem", methods=["GET"])
def receber_mesnsagem():
    comando.execute('SELECT usuario_id, mensagem, foto_de_perfil,nome_de_usuario FROM mensagem')
    mensagens = comando.fetchall()
    return {i: {"usuario_id": mensagens[i][0], "mensagem": mensagens[i][1], "fotodeperfil": mensagens[i][2], "nome": mensagens[i][3]} for i in range(len(mensagens))}

@app.route('/api/getcontas', methods=['POST'])
def getcontas():
    data = flask.request.get_json()
    indentificação = data.get("idendficação")
    comando.execute('SELECT id, nome, Foto_de_perfil FROM usuario WHERE indentificação = ?', (indentificação,))
    conta = comando.fetchall()
    return conta

@app.route('/api/enviar-imagem', methods=['POST'])
def upload():
    idendficação = flask.request.form['idendficação']
    nome = flask.request.form['nome']
    if "imagem" not in flask.request.files:
        pass
    else:
        imagem = flask.request.files['imagem']
    comando.execute('UPDATE usuario SET Foto_de_perfil = ? WHERE indentificação = ?', (idendficação, idendficação))
    comando.execute('UPDATE usuario SET nome = ? WHERE indentificação = ?', (nome, idendficação))
    banco.commit()
    return "imagem recebida"

if __name__ == "__main__":
    socket.run(app,debug=True)
    """ app.run(debug=True, port=5000) """