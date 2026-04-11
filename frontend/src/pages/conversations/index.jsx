import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaComments,
  FaSearch,
  FaClock,
  FaChevronRight,
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { socket } from "../../socket";


const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff, #eef2ff);
  padding: 30px 20px 100px;
`;

const Header = styled.div`
  max-width: 900px;
  margin: 0 auto 28px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #1f2a44;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 15px;
`;

const SearchBox = styled.div`
  max-width: 900px;
  margin: 0 auto 28px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(31, 42, 68, 0.05);
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  color: #1f2a44;
  background: transparent;
`;

const List = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  border: 1px solid #edf1ff;
  box-shadow: 0 10px 28px rgba(31, 42, 68, 0.06);
  transition: all 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 34px rgba(31, 42, 68, 0.1);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 22px;
  object-fit: cover;
  background: #eef2ff;
`;

const OnlineDot = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #22c55e;
  border: 3px solid white;
  border-radius: 50%;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #1f2a44;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Meta = styled.span`
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  gap: 12px;
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #5f6b85;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserDetails = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #8a94a6;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RightIcon = styled.div`
  color: #9aa4b2;
  font-size: 18px;
`;

const EmptyState = styled.div`
  max-width: 900px;
  margin: 80px auto;
  background: white;
  border-radius: 28px;
  padding: 50px 30px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.06);
  border: 1px solid #edf1ff;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #4f6cff;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h2`
  color: #1f2a44;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  color: #6b7280;
  font-size: 15px;
`;

const Loading = styled.h3`
  text-align: center;
  margin-top: 80px;
  color: #374151;
`;

const ErrorBox = styled.div`
  max-width: 700px;
  margin: 60px auto;
  background: #fff5f5;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 18px;
  padding: 18px;
  text-align: center;
`;

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [monProfilId, setMonProfilId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageErreur, setMessageErreur] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
 

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "sent":
        return <FaCheck color="#9ca3af" size={12} />;

      case "delivered":
        return <FaCheckDouble color="#9ca3af" size={12} />;

      case "seen":
        return <FaCheckDouble color="#3b82f6" size={12} />;

      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



useEffect(() => {
  socket.connect();

  const handleReceiveMessage = (message) => {
    console.log("📩 nouveau message reçu :", message);

    setConversations((prev) => {
      // chercher la conversation correspondante
      const index = prev.findIndex(
        (conv) =>
          conv.participants.some((p) => p._id === message.expediteur) ||
          conv.participants.some((p) => p._id === message.destinataire)
      );

      // 🔥 si conversation existe
      if (index !== -1) {
        const updated = [...prev];

        updated[index] = {
          ...updated[index],
          dernierMessage:
            message.type === "image"
              ? message.contenu
                ? `📷 ${message.contenu}`
                : "📷 Image"
              : message.contenu,
          dernierMessageDate: message.createdAt,
          dernierMessageStatut: message.statut,
        };

        // 🔥 remonter en haut (comme WhatsApp)
        const conv = updated.splice(index, 1)[0];
        return [conv, ...updated];
      }

      // ❗ si conversation n'existe pas → ignorer (ou refetch)
      return prev;
    });
  };

  socket.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, []);



socket.on("messageDelivered", ({ messageId }) => {
  setConversations((prev) =>
    prev.map((conv) =>
      conv.dernierMessageId === messageId
        ? { ...conv, dernierMessageStatut: "delivered" }
        : conv
    )
  );
});



useEffect(() => {
  socket.on("messagesRead", () => {
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        dernierMessageStatut: "seen",
      }))
    );
  });

  return () => {
    socket.off("messagesRead");
  };
}, []);





  useEffect(()  => {
    const chargerConversations = async () => {
      try {
        setLoading(true);
        setMessageErreur("");

        // 1) récupérer le profil de l'utilisateur connecté
        const monProfilRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mesInfos/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const monProfilData = await monProfilRes.json();

        if (!monProfilRes.ok) {
          throw new Error(
            monProfilData.message || "Impossible de récupérer ton profil",
          );
        }

        setMonProfilId(monProfilData._id);

        // 2) récupérer les conversations
        const conversationsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tchat/conversations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const conversationsData = await conversationsRes.json();

        if (!conversationsRes.ok) {
          throw new Error(
            conversationsData.message ||
              "Impossible de récupérer les conversations",
          );
        }

        setConversations(conversationsData);
        
      } catch (error) {
        setMessageErreur(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      chargerConversations();
    }
  }, [token]);

  // récupérer l'autre participant
  const getAutreParticipant = (participants) => {
    return participants.find((p) => p._id !== monProfilId);
  };

  // filtre recherche 
  const conversationsFiltrees = conversations.filter((conv) => {
    const autre = getAutreParticipant(conv.participants);
    if (!autre) return false;

    return autre.pseudo.toLowerCase().includes(filtre.toLowerCase());
  });

  if (loading) {
    return <Loading>Chargement des conversations...</Loading>;
  }

  if (messageErreur) {
    return <ErrorBox>{messageErreur}</ErrorBox>;
  }


  return (
    <Page>
      <Header>
        <Title>Mes conversations</Title>
        <Subtitle>
          Retrouve ici toutes tes discussions et continue là où tu t’es arrêté.
        </Subtitle>
      </Header>

      <SearchBox>
        <FaSearch color="#6b7280" />
        <SearchInput
          type="text"
          placeholder="Rechercher une conversation..."
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        />
      </SearchBox>

      {conversationsFiltrees.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FaComments />
          </EmptyIcon>
          <EmptyTitle>Aucune conversation pour le moment</EmptyTitle>
          <EmptyText>
            Quand tu commenceras à discuter avec un match, tes conversations
            apparaîtront ici.
          </EmptyText>
        </EmptyState>
      ) : (
        <List>
          {conversationsFiltrees.map((conversation) => {
            const autre = getAutreParticipant(conversation.participants);

            if (!autre) return null;

            return (
              <Card
                key={conversation._id}
                onClick={() => navigate(`/tchat/${autre._id}`)}
              >
                <AvatarWrapper>
                  <Avatar
                    src={autre.avatar?.url || "https://via.placeholder.com/150"}
                    alt={autre.pseudo}
                  />
                </AvatarWrapper>
                <Info>
                  <TopRow>
                    <Name>
                      {autre.pseudo}
                      {autre.verifie && <MdVerified color="#4f6cff" />}
                    </Name>
                    <Meta>{formatDate(conversation.dernierMessageDate)}</Meta>
                  </TopRow>

                  <UserDetails>
                    {autre.age} ans <BsDot /> {autre.ville}, {autre.pays}
                  </UserDetails>

                  <BottomRow>
                    <LastMessage>
                      {conversation.dernierMessage || "Aucun message"}

                      <span style={{ marginLeft: "6px" }}>
                        {conversation.dernierMessageStatut &&
                          getStatutIcon(conversation.dernierMessageStatut)}
                      </span>
                    </LastMessage>

                    <RightIcon>
                      <FaChevronRight />
                    </RightIcon>
                  </BottomRow>
                </Info>
              </Card>
            );
          })}
        </List>
      )}
    </Page>
  );
}

export default Conversations;
