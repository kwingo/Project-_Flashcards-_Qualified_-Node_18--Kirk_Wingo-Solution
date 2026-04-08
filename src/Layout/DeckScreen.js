import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";

function DeckScreen() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  const handleDeleteDeck = () => {
    const confirmDelete = window.confirm(
      "Delete this deck? You will not be able to recover it."
    );

    if (confirmDelete) {
      deleteDeck(deckId).then(() => navigate("/"));
    }
  };

  const handleDeleteCard = (cardId) => {
    const confirmDelete = window.confirm(
      "Delete this card? You will not be able to recover it."
    );

    if (confirmDelete) {
      deleteCard(cardId).then(() => {
        setDeck((current) => ({
          ...current,
          cards: current.cards.filter((card) => card.id !== cardId),
        }));
      });
    }
  };

  if (!deck) return <p>Loading...</p>;

  return (
    <section>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deck.name}
          </li>
        </ol>
      </nav>

      <div className="card mb-3">
        <div className="card-body">
          <h2>{deck.name}</h2>
          <p>{deck.description}</p>

          <Link to={`/decks/${deck.id}/edit`} className="btn btn-secondary mr-2">
            Edit
          </Link>
          <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">
            Study
          </Link>
          <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary mr-2">
            Add Cards
          </Link>
          <button className="btn btn-danger" onClick={handleDeleteDeck}>
            Delete
          </button>
        </div>
      </div>

      <h3>Cards</h3>

      {deck.cards.map((card) => (
        <div key={card.id} className="card mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col">
                <p>{card.front}</p>
              </div>
              <div className="col">
                <p>{card.back}</p>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <Link
                to={`/decks/${deck.id}/cards/${card.id}/edit`}
                className="btn btn-secondary mr-2"
              >
                Edit
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteCard(card.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default DeckScreen;