import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readDeck, createCard } from "../utils/api";

function NewCardScreen() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [formData, setFormData] = useState({ front: "", back: "" });

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createCard(deckId, formData).then(() => {
      setFormData({ front: "", back: "" });
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
            Add Card
          </li>
        </ol>
      </nav>

      <h2>{deck.name}: Add Card</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="front">Front</label>
          <textarea
            id="front"
            name="front"
            className="form-control"
            placeholder="Front side of card"
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
            placeholder="Back side of card"
            value={formData.back}
            onChange={handleChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary mr-2"
          onClick={() => navigate(`/decks/${deck.id}`)}
        >
          Done
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </section>
  );
}

export default NewCardScreen;