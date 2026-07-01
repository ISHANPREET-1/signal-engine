import "./ContactCard.css";

export default function ContactCard({ contact }) {
  if (!contact) return null;

  const initials = `${contact.firstName?.[0] || ""}${
    contact.lastName?.[0] || ""
  }`;

  return (
    <div className="contactCard">

      <div className="contactHeader">

        <div className="avatar">
          {initials || "DM"}
        </div>

        <div>

          <h2>Decision Maker</h2>

          

        </div>

      </div>

      <div className="contactInfo">

        <h3>
          {contact.firstName} {contact.lastName}
        </h3>

        <div className="role">
          {contact.role}
        </div>

        <a href={`mailto:${contact.email}`}>
          {contact.email}
        </a>

        <div className="confidence">
          ✓ {contact.confidence}% Confidence
        </div>

      </div>

    </div>
  );
}