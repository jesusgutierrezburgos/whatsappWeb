import { createClient } from "@supabase/supabase-js";

// VARIABLES GLOBALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Inicialización de Supabase con las variables globales
const supabase = createClient(supabaseUrl, supabaseKey);

// Evento de envío del formulario de login
document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("nick").value;
  const password = document.getElementById("pass").value;
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.textContent = "";

  try {
    // Realizar login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      errorMessageElement.textContent =
        "Error: Usuario o contraseña incorrectos.";
    } else {
      // Guardar los tokens de acceso y redirigir a la página principal
      sessionStorage.setItem("user_id", data.user.id);
      window.location.href = "main.html";
    }
  } catch (err) {
    console.error(err);
    errorMessageElement.textContent =
      "Error: Algo salió mal. Inténtalo de nuevo más tarde.";
  }
});
