const API_URL = import.meta.env.VITE_API_URL;


export const marquerMessagesCommeLusApi = async (profilId, token) => {
  const response = await fetch(
    `${API_URL}/tchat/lire/${profilId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors du marquage des messages lus");
  }

  return data;
};

export const getMonProfil = async (token) => {
  const res = await fetch(`${API_URL}/api/mesInfos/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Impossible de récupérer ton profil");
  }

  return data;
};

export const getProfilCible = async (profilId) => {
  const res = await fetch(`${API_URL}/api/mesInfos/${profilId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Impossible de récupérer le profil");
  }

  return data;
};

export const getMessagesConversation = async (profilId, token) => {
  const res = await fetch(`${API_URL}/api/tchat/messages/${profilId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Impossible de récupérer les messages");
  }

  return data;
};

export const envoyerMessageApi = async (profilId, token, formData) => {
  const res = await fetch(`${API_URL}/api/tchat/envoyer/${profilId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de l’envoi du message");
  }

  return data;
};