import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DeckForm({
  title,
  initialDeck = { name: "", description: "" },
  onSubmit,
  cancelPath,
}) {
  const [formData, setFormData] = useState(initialDeck);

  const handleChange = ({ target }) => {
    setFormData((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>

      <div className="form-group">
        <label htmlFor="deck-name">Name</label>
        <input
          id="deck-name"
          name="name"
          type="text"
          className="form-control"
          placeholder="Deck Name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deck-description">Description</label>
        <textarea
          id="deck-description"
          name="description"
          className="form-control"
          placeholder="Brief description of the deck"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <Link to={cancelPath} className="btn btn-secondary mr-2">
        Cancel
      </Link>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default DeckForm;