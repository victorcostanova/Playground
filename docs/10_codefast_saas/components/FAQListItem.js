"use client";

const FAQListItem = ({ qa }) => {
  return (
    <li key={qa.question}>
      <button onClick={() => {}}>{qa.question}</button>

      <div>{qa.answer}</div>
    </li>
  );
};

export default FAQListItem;
