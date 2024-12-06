import Avatar from "@mui/material/Avatar";
/* eslint-disable react/prop-types */
function Chat({chat,onSelectChat}){
  const fechaObj = new Date(chat.fecha_ultimo_mensaje);
  const fechaFormateada = fechaObj.getHours() + ":" + fechaObj.getMinutes().toString().padStart(2, "0");
return(
    <>
    <div
      key={chat.chat_id}
      className="chat-item"
      onClick={() => onSelectChat(chat)}
    >
      <div className="chat-container">
        {chat.usuario_avatar ? (
          <Avatar className="avatar" src={chat.usuario_avatar} alt={chat.usuario_nombre} />
        ) : (
          <Avatar className="avatar">{chat.usuario_nombre.charAt(0).toUpperCase()}</Avatar>
        )}

        <div className="chat-info">
          <h4>{chat.usuario_nombre}</h4>
          <div className="ultimo-mensaje">
            <p>{chat.ultimo_mensaje}</p>
            <p>{fechaFormateada}</p>
          </div>
          
        </div>
      </div>
    </div>
    </>
)
}
export default Chat