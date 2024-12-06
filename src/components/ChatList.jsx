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

function ChatList({ onSelectChat, busqueda }) { // Añadimos busqueda como prop
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function importarChats() {
      try {
        const { data, error } = await supabase
          .from("chats")
          .select(
            `id, 
            ultimo_mensaje, 
            fecha_ultimo_mensaje,
            usuario1_id,
            usuario2_id,
            usuario1:usuario1_id(id, nombre, avatar, es_grupo),
            usuario2:usuario2_id(id, nombre, avatar, es_grupo)`
          )
          .or(`usuario1_id.eq.${user_id},usuario2_id.eq.${user_id}`); // Filtrar chats donde participa user_id

        if (error) {
          console.error("Error fetching chats:", error.message);
        } else {
          const chatsProcesados = data.map((chat) => {
            const otroUsuario =
              chat.usuario1_id === user_id ? chat.usuario2 : chat.usuario1;

            return {
              chat_id: chat.id,
              ultimo_mensaje: chat.ultimo_mensaje,
              fecha_ultimo_mensaje: chat.fecha_ultimo_mensaje,
              usuario_id: otroUsuario.id,
              usuario_nombre: otroUsuario.nombre,
              usuario_avatar: otroUsuario.avatar,
              es_grupo: otroUsuario.es_grupo,
            };
          });
          setChats(chatsProcesados);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    importarChats();

    // Suscripción a actualizaciones de la tabla "chats"
    const canal = supabase
      .channel("tabla-chats")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chats" },
        (payload) => {
          const chatActualizado = payload.new;
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chat_id === chatActualizado.id
                ? { ...chat, ...chatActualizado }
                : chat
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  // Filtrar chats según busqueda
  const chatsFiltrados = chats.filter((chat) =>
    chat.usuario_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="chat-list">
      {chatsFiltrados.map((c) => (
        <Chat key={c.chat_id} chat={c} onSelectChat={onSelectChat}></Chat>
      ))}
    </div>
  );
}

export default ChatList;
