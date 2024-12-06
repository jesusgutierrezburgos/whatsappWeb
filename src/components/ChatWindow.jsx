import { useEffect, useState } from "react";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";
import { createClient } from "@supabase/supabase-js";
/* eslint-disable react/prop-types */

// VARIABLES GLOBALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const userId = sessionStorage.getItem("user_id");

const supabase = createClient(supabaseUrl, supabaseKey);

function ChatWindow({ selectedChat }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  // Función para suscribirse a nuevos mensajes
  function subscribirseMensajes() {
    const canal = supabase
      .channel("tabla-mensajes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes" },
        (payload) => {
          const nuevoMensaje = payload.new;
          // Actualizar el estado con el nuevo mensaje
          setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal); // Limpiar suscripción al desmontar
    };
  }

  // Obtener los mensajesPriv cuando se selecciona un chat
  useEffect(() => {
    if (!selectedChat) return;

    async function importarMensajesPriv() {
      const { data, error } = await supabase
        .from("mensajes")
        .select("*")
        .eq("chat_id", selectedChat.chat_id)

      if (error) {
        console.error("Error importando mensajesPriv:", error.message);
      } else {
        setMensajes(data);
      }
    }

    async function importarMensajesGrupo() {
      const { data, error } = await supabase
      .from("mensajes")
      .select(`*,
        emisor:emisor_id(id, nombre, avatar)`)
      .eq("receptor_id",selectedChat.usuario_id);
      if (error) {
        console.error("Error importando mensajes del grupo:", error.message);
      } else {
        // Procesar los datos para obtener solo los datos relevantes
        const mensajesProcesados = data.map((mensaje) => {
          // Determinar quién es el emisor
          const emisor = mensaje.emisor

          return {
            contenido: mensaje.contenido,
            mensaje_id: mensaje.id,
            fecha_mensaje: mensaje.fecha_mensaje,
            emisor_id: emisor.id,
            emisor_nombre: emisor.nombre,
            emisor_avatar:emisor.avatar,
          };
        });

        setMensajes(mensajesProcesados);
      }

    }

    if (selectedChat.es_grupo) {
      importarMensajesGrupo();
    } else {
      importarMensajesPriv();
    }
    subscribirseMensajes(); // Suscribirse a nuevos mensajes
    
    return () => subscribirseMensajes(); // Limpiar suscripción al desmontar el componente
  }, [selectedChat]); // Ejecutar cada vez que cambie selectedChat

  const enviarMensaje = async () => {
    if (nuevoMensaje.trim()) {
      const { error } = await supabase.from("mensajes").insert([
        {
          chat_id: selectedChat.chat_id,
          emisor_id: userId,
          receptor_id: selectedChat.usuario_id,
          contenido: nuevoMensaje,
          fecha_mensaje: new Date(),
        },
      ]);

      const { error2 } = await supabase
      .from("chats")
      .update({ ultimo_mensaje: nuevoMensaje, fecha_ultimo_mensaje: new Date()})
      .eq("id", selectedChat.chat_id);

      if (error || error2) {
        console.error("Error al actualizar el mensaje:", error);
      } else {
        setNuevoMensaje("");
        console.log("Mensaje actualizado correctamente.");
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="chat-window">
        <div className="no-chat">
          <p className="no-chat-selected">Selecciona un chat para empezar a chatear</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {selectedChat.usuario_avatar ? (
          <Avatar
            src={selectedChat.usuario_avatar}
            alt={selectedChat.usuario_nombre}
          />
        ) : (
          <Avatar>{selectedChat.usuario_nombre.charAt(0).toUpperCase()}</Avatar>
        )}

        <h3>{selectedChat.usuario_nombre}</h3>
      </div>

      {/* Mostrar los mensajes */}
      <div className="mensajes">
        {mensajes.map((mensaje) => (
          <Message
            key={mensaje.id}
            contenido={mensaje.contenido}
            emisorId={mensaje.emisor_id}
            emisorNombre = {mensaje.emisor_nombre}
            fecha={mensaje.fecha_mensaje}
            esGrupo = {selectedChat.es_grupo}
            emisorAvatar = {mensaje.emisor_avatar}
          />
        ))}
      </div>

      {/* Input y botones */}
      <div className="input-box">
        <Fab className="botones-mensajes" sx={{ backgroundColor: "#293841" }} variant="extended">
          <AttachFileIcon sx={{ color: "#8696A0" }} />
        </Fab>
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <Fab className="botones-mensajes" sx={{ backgroundColor: "#293841"}} variant="extended" onClick={enviarMensaje}>
          <SendIcon sx={{ color: "#8696A0" }} />
        </Fab>
        
      </div>
    </div>
  );
}

export default ChatWindow;
