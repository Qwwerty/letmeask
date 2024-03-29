import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { EmptyState } from "../components/EmptyState";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { Modal } from "../components/Modal";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import { TrashSimple, XCircle } from "phosphor-react";
import { useAuth } from "../hooks/useAuth";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalQuestionClosedOpen, setIsModalQuestionClosedOpen] =
    useState(false);
  const [questionIdDelete, setQuestionIdDelete] = useState("");

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title, roomOwnerId } = useRoom(roomId || "");

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    setIsModalQuestionClosedOpen(false);

    navigate("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion() {
    try {
      await database
        .ref(`rooms/${roomId}/questions/${questionIdDelete}`)
        .remove();
    } catch (error) {
      showToast("Não foi possível remover a pergunta.", "error");
    } finally {
      setIsModalOpen(false);
    }
  }

  function openModalDelete(questionId: string) {
    setIsModalOpen(!isModalOpen);
    setQuestionIdDelete(questionId);
  }

  useEffect(() => {
    if (roomOwnerId !== user?.id) {
      navigate(`/rooms/${roomId}`);
      return;
    }
  }, []);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={() => setIsModalQuestionClosedOpen(true)}
            >
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        {questions.length > 0 ? (
          <div className="question-list">
            {questions.map((question) => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => openModalDelete(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            ))}

            {isModalOpen && (
              <Modal
                title="Excluir pergunta"
                description="Tem certeza que você deseja excluir esta pergunta?"
                confirmText="Sim, excluir"
                confirm={handleDeleteQuestion}
                cancel={() => setIsModalOpen(false)}
              >
                <TrashSimple />
              </Modal>
            )}
          </div>
        ) : (
          <EmptyState />
        )}

        {isModalQuestionClosedOpen && (
          <Modal
            title="Encerrar sala"
            description="Tem certeza que você deseja encerrar esta sala?"
            confirmText="Sim, encerrar"
            confirm={handleEndRoom}
            cancel={() => setIsModalQuestionClosedOpen(false)}
          >
            <XCircle />
          </Modal>
        )}
      </main>
    </div>
  );
}
