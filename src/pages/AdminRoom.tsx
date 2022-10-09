import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import { Modal } from "../components/Modal";
import { useState } from "react";
import { useToast } from "../hooks/useToast";
import { Trash } from "phosphor-react";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const [isModelOpen, setIsModalOpen] = useState(false);

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId || "");
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

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

  async function handleDeleteQuestion(questionId: string) {
    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    } catch (error) {
      showToast("Não foi possível remover a pergunta.", "error");
    } finally {
      setIsModalOpen(false);
    }
  }

  function toogleOpenModalDelete() {
    setIsModalOpen(!isModelOpen);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
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
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}
              <button type="button" onClick={toogleOpenModalDelete}>
                <img src={deleteImg} alt="Remover pergunta" />
              </button>

              {isModelOpen && (
                <Modal
                  title="Excluir pergunta"
                  description="Tem certeza que você deseja excluir esta pergunta?"
                  confirm={() => handleDeleteQuestion(question.id)}
                  cancel={toogleOpenModalDelete}
                >
                  <Trash size={48} />
                </Modal>
              )}
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
