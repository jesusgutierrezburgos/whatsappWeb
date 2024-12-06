import { useEffect, useState } from "react";
import Chat from "./Chat";
import { createClient } from "@supabase/supabase-js";
/* eslint-disable react/prop-types */

// VARIABLES GLOBALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const user_id = sessionStorage.getItem("user_id"); // user_id en formato UUID

// Inicialización de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data, error } = await supabase
          .from("contactos")
          .select(
            `
            id, 
            seguidor_id, 
            contacto_id,
            contacto:contacto_id(id, nombre, avatar)`
          )
          .eq("seguidor_id", user_id);

        if (error) {
          console.error("Error fetching contactos:", error.message);
        } else {
          // Procesar los datos para obtener solo los datos relevantes
          const chatsProcesados = data.map((chat) => {
            // Determinar quién es el "otro usuario"
            const otroUsuario =
              chat.usuario1_id === user_id ? chat.usuario2 : chat.usuario1;

            return {
              chat_id: chat.id,
              ultimo_mensaje: chat.ultimo_mensaje,
              fecha_ultimo_mensaje: chat.fecha_ultimo_mensaje,
              usuario_nombre: otroUsuario.nombre,
              usuario_avatar: otroUsuario.avatar,
            };
          });

          setChats(chatsProcesados);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchChats();
  }, []); // Ejecuta la función al montar el componente

  return (
    <div className="chat-list">
      {chats.map((c) => (
        <Chat key={c.chat_id} chat={c} onSelectChat={onSelectChat}></Chat>
      ))}
    </div>
  );
}

export default ChatList;
