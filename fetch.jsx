const options = {
  method: "GET",
  headers: {
    "User-Agent": "insomnia/10.1.1",
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocGFjcHVuenJlaXJzZ3NoZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODQ0MzAsImV4cCI6MjA0NzA2MDQzMH0.gLRaO-9BT3cD8PYUle9zLNvKsOC7mj2nVzdOLrPc5D0",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocGFjcHVuenJlaXJzZ3NoZHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODQ0MzAsImV4cCI6MjA0NzA2MDQzMH0.gLRaO-9BT3cD8PYUle9zLNvKsOC7mj2nVzdOLrPc5D0",
  },
};

fetch(
  "https://qhpacpunzreirsgshdub.supabase.co/rest/v1/mensajes?select=*",
  options
)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
