import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaComments,
  FaSearch,
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
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
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
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 22px;
  object-fit: cover;
`;

const Info = styled.div`
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Name = styled.h3`
  margin: 0;
  display: flex;
  gap: 8px;
`;

const Meta = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const LastMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #5f6b85;
`;

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [monProfilId, setMonProfilId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getStatutIcon = (statut) => {
    if (statut === "sent") return <FaCheck size={12} />;
    if (statut === "delivered") return <FaCheckDouble size={12} />;
    if (statut === "seen") return <FaCheckDouble color="blue" size={12} />;
  };

  // ================= SOCKET =================

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setConversations((prev) => {
        const index = prev.findIndex(
          (conv) => conv._id === message.conversationId
        );

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
            dernierMessageId: message._id,
          };

          const conv = updated.splice(index, 1)[0];
          return [conv, ...updated];
        }

        return prev;
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const handleDelivered = ({ messageId }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.dernierMessageId === messageId
            ? { ...conv, dernierMessageStatut: "delivered" }
            : conv
        )
      );
    };

    socket.on("messageDelivered", handleDelivered);

    return () => {
      socket.off("messageDelivered", handleDelivered);
    };
  }, []);

  useEffect(() => {
    const handleSeen = ({ idsMessagesLus }) => {
      setConversations((prev) =>
        prev.map((conv) =>
          idsMessagesLus.includes(conv.dernierMessageId)
            ? { ...conv, dernierMessageStatut: "seen" }
            : conv
        )
      );
    };

    socket.on("messagesRead", handleSeen);

    return () => {
      socket.off("messagesRead", handleSeen);
    };
  }, []);

  // ================= API =================

  useEffect(() => {
    const fetchData = async () => {
      const me = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());

      setMonProfilId(me._id);

      const convs = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tchat/conversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((r) => r.json());

      setConversations(convs);
    };

    if (token) fetchData();
  }, [token]);

  const getAutre = (participants) =>
    participants.find((p) => p._id !== monProfilId);

  const filtered = conversations.filter((conv) => {
    const autre = getAutre(conv.participants);
    return autre?.pseudo.toLowerCase().includes(filtre.toLowerCase());
  });

  return (
    <Page>
      <Header>
        <Title>Mes conversations</Title>
        <Subtitle>Continue tes discussions</Subtitle>
      </Header>

      <SearchBox>
        <FaSearch />
        <SearchInput
          placeholder="Rechercher..."
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        />
      </SearchBox>

      {filtered.length === 0 ? (
        <div>Aucune conversation</div>
      ) : (
        <List>
          {filtered.map((conv) => {
            const autre = getAutre(conv.participants);
            if (!autre) return null;

            return (
              <Card
                key={conv._id}
                onClick={() => navigate(`/tchat/${autre._id}`)}
              >
                <Avatar src={autre.avatar?.url} />

                <Info>
                  <TopRow>
                    <Name>
                      {autre.pseudo}
                      {autre.verifie && <MdVerified />}
                    </Name>
                    <Meta>
                      {new Date(conv.dernierMessageDate).toLocaleString()}
                    </Meta>
                  </TopRow>

                  <BottomRow>
                    <LastMessage>
                      {conv.dernierMessage}
                      {getStatutIcon(conv.dernierMessageStatut)}
                    </LastMessage>
                    <FaChevronRight />
                  </BottomRow>
                </Info>
              </Card>
            );
          })}
        </List>
      )}
    </Page>
  );
};

export default Conversations;