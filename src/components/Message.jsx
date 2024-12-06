/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
const userId = sessionStorage.getItem("user_id");

function Message({ contenido, emisorId, emisorNombre, fecha, esGrupo, emisorAvatar }) {
  const fechaObj = new Date(fecha);
  const fechaFormateada = fechaObj.getHours() + ":" + fechaObj.getMinutes().toString().padStart(2, "0");

  return (
    <>
    <div className="mensaje-container">
      {esGrupo && emisorId !== userId && (
      <div>
        <Avatar className="avatar"
          src={emisorAvatar}
          alt={emisorAvatar}
        />
      </div>
      )}
      <div
        className={`message ${emisorId === userId ? "enviado" : "recibido"}`}
      >
        {esGrupo && emisorId !== userId && (
          <div className="emisorDatos">
            <p>{emisorNombre}</p>
          </div>
        )}
        <div className="contenido-mensaje">
          <p className="contenido">{contenido}</p>
          <p className="fecha">{fechaFormateada}</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Message;