import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readDeck, readCard, updateCard } from "../utils/api";

function EditCardScreen() {
  const { deckId, cardId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [formData, setFormData] = useState({ front: "", back: "" });

  useEffect(() => {
    const abortController = new AbortController();

    readDeck(deckId, abortController.signal).then(setDeck);
    readCard(cardId, abortController.signal).then((card) => {
      setFormData({
        front: card.front,
        back: card.back,
      });
    });

    return () => abortController.abort();
  }, [deckId, cardId]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateCard({
      id: Number(cardId),
      deckId: Number(deckId),
      ...formData,
    }).then(() => navigate(`/decks/${deckId}`));
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
            Edit Card {cardId}
          </li>
        </ol>
      </nav>

      <h2>Edit Card</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="front">Front</label>
          <textarea
            id="front"
            name="front"
            className="form-control"
            value={formData.front}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="back">Back</label>
          <textarea
            id="back"
            name="back"
            className="form-control"
            value={formData.back}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => navigate(`/decks/${deckId}`)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </section>
  );
}

export default EditCardScreen;