import { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import { listDecks, readCard, readDeck } from "../utils/api";

function Home() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    listDecks(abortController.signal).then(setDecks);
    return () => abortController.abort();
  }, []);

  return (
    <>
      <div className="mb-4">
        <Link to="/decks/new" className="btn btn-secondary">
          Create Deck
        </Link>
      </div>
      {decks.map((deck) => (
        <section key={deck.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <h2>{deck.name}</h2>
              <p>{deck.cards?.length || 0} cards</p>
            </div>
            <p>{deck.description}</p>
          </div>
        </section>
      ))}
    </>
  );
}

function DeckForm({ title, initialDeck }) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (initialDeck) {
      setFormData({
        name: initialDeck.name || "",
        description: initialDeck.description || "",
      });
    }
  }, [initialDeck]);

  return (
    <form>
      <h2>{title}</h2>
      <div className="form-group">
        <label htmlFor="deck-name">Name</label>
        <input
          id="deck-name"
          className="form-control"
          value={formData.name}
          onChange={({ target }) =>
            setFormData((current) => ({ ...current, name: target.value }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="deck-description">Description</label>
        <textarea
          id="deck-description"
          className="form-control"
          value={formData.description}
          onChange={({ target }) =>
            setFormData((current) => ({
              ...current,
              description: target.value,
            }))
          }
        />
      </div>
    </form>
  );
}

function CreateDeckScreen() {
  return <DeckForm title="Create Deck" />;
}

function EditDeckScreen() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  if (!deck) {
    return null;
  }

  return <DeckForm title="Edit Deck" initialDeck={deck} />;
}

function DeckScreen() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  if (!deck) {
    return null;
  }

  return (
    <section>
      <h2>{deck.name}</h2>
      <p>{deck.description}</p>
      {deck.cards?.map((card) => (
        <article key={card.id} className="card mb-3">
          <div className="card-body">
            <p>{card.front}</p>
            <p>{card.back}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function CardForm({ title, deckName, initialCard }) {
  const [formData, setFormData] = useState({ front: "", back: "" });

  useEffect(() => {
    if (initialCard) {
      setFormData({
        front: initialCard.front || "",
        back: initialCard.back || "",
      });
    }
  }, [initialCard]);

  return (
    <form>
      <h2>{deckName}</h2>
      <h3>{title}</h3>
      <div className="form-group">
        <label htmlFor="card-front">Front</label>
        <textarea
          id="card-front"
          className="form-control"
          value={formData.front}
          onChange={({ target }) =>
            setFormData((current) => ({ ...current, front: target.value }))
          }
        />
      </div>
      <div className="form-group">
        <label htmlFor="card-back">Back</label>
        <textarea
          id="card-back"
          className="form-control"
          value={formData.back}
          onChange={({ target }) =>
            setFormData((current) => ({ ...current, back: target.value }))
          }
        />
      </div>
    </form>
  );
}

function NewCardScreen() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  if (!deck) {
    return null;
  }

  return <CardForm title="Add Card" deckName={deck.name} />;
}

function EditCardScreen() {
  const { deckId, cardId } = useParams();
  const [deck, setDeck] = useState(null);
  const [card, setCard] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    readCard(cardId, abortController.signal).then(setCard);
    return () => abortController.abort();
  }, [deckId, cardId]);

  if (!deck || !card) {
    return null;
  }

  return <CardForm title="Edit Card" deckName={deck.name} initialCard={card} />;
}

function StudyScreen() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then(setDeck);
    return () => abortController.abort();
  }, [deckId]);

  if (!deck) {
    return null;
  }

  if (!deck.cards || deck.cards.length < 3) {
    return (
      <section>
        <h2>{deck.name}</h2>
        <p>Not enough cards.</p>
      </section>
    );
  }

  const card = deck.cards[cardIndex];

  return (
    <section>
      <h2>{deck.name}</h2>
      <div className="card">
        <div className="card-body">
          <h3>
            Card {cardIndex + 1} of {deck.cards.length}
          </h3>
          <p>{isFront ? card.front : card.back}</p>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={() => setIsFront((current) => !current)}
          >
            Flip
          </button>
          {!isFront ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCardIndex((current) => (current + 1) % deck.cards.length);
                setIsFront(true);
              }}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        <h1>Welcome to Flashcard-o-matic</h1>
        <p>Discover The Flashcard Difference</p>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks/new" element={<CreateDeckScreen />} />
          <Route path="/decks/:deckId/edit" element={<EditDeckScreen />} />
          <Route path="/decks/:deckId/cards/new" element={<NewCardScreen />} />
          <Route
            path="/decks/:deckId/cards/:cardId/edit"
            element={<EditCardScreen />}
          />
          <Route path="/decks/:deckId/study" element={<StudyScreen />} />
          <Route path="/decks/:deckId" element={<DeckScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default Layout;
