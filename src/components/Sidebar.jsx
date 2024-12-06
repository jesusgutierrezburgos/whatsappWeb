import { useState } from "react";
import ChatList from "./ChatList";
/* eslint-disable react/prop-types */
function Sidebar({ onSelectChat, isOpen, onClose }) {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 style={{ marginLeft: "10px"}}>
          Chats
        </h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="barra-busqueda">
        <input
          type="text"
          placeholder="Buscar chats..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <ChatList
        busqueda={busqueda} // Pasar searchTerm como prop
        onSelectChat={(chat_id) => {
          onSelectChat(chat_id);
          onClose(); // Cerrar el sidebar al seleccionar un chat en pantallas pequeñas
        }}
      />
    </div>
  );
}

export default Sidebar;
