import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api";
import DeckForm from "./DeckForm";

function EditDeckScreen() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  const handleSubmit = (deckData) => {
    updateDeck({ ...deck, ...deckData }).then(() => {
      navigate(`/decks/${deckId}`);
    });
  };

  if (!deck) return <p>Loading...</p>;

  return (
    <section>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit Deck
          </li>
        </ol>
      </nav>

      <DeckForm
        title="Edit Deck"
        initialDeck={deck}
        onSubmit={handleSubmit}
        cancelPath={`/decks/${deck.id}`}
      />
    </section>
  );
}

export default EditDeckScreen;