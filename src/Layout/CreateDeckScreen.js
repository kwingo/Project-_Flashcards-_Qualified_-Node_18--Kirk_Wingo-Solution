import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createDeck } from "../utils/api";
import DeckForm from "./DeckForm";

function CreateDeckScreen() {
  const navigate = useNavigate();

  const handleCreateDeck = (deckData) => {
    const abortController = new AbortController();

    createDeck(deckData, abortController.signal).then((createdDeck) => {
      navigate(`/decks/${createdDeck.id}`);
    });

    return () => abortController.abort();
  };

  return (
    <section>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Deck
          </li>
        </ol>
      </nav>

      <DeckForm
        title="Create Deck"
        onSubmit={handleCreateDeck}
        cancelPath="/"
      />
    </section>
  );
}

export default CreateDeckScreen;