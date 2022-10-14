import emptyQuestionsImg from "../assets/images/empty-questions.svg";

import "../styles/empty-state.scss";

export function EmptyState() {
  return (
    <div id="empty-state">
      <img src={emptyQuestionsImg} alt="Nenhuma pergunta foi realizada" />

      <div>

        <p>Nenhuma pergunta por aqui...</p>
        <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
      </div>
    </div>
  );
}
