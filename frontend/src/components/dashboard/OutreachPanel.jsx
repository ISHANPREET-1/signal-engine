import "./OutreachPanel.css";

export default function OutreachPanel({ outreach, hasRealSignals = true }) {
  if (!outreach) {
    if (hasRealSignals) return null;

    return (
      <div className="outreachPanel">

        <div className="outreachHeader">

          <div>

            <h2> AI Outreach</h2>

            <p>
              Personalized using buying signals and LLM reasoning
            </p>

          </div>

        </div>

        <div className="outreachBlock">

          <div className="blockBody">
            Not enough signal data to generate personalized outreach for this company yet.
          </div>

        </div>

      </div>
    );
  }

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <div className="outreachPanel">

     <div className="outreachHeader">

  <div>

    <h2> AI Outreach</h2>

    <p>
      Personalized using buying signals and LLM reasoning
    </p>

  </div>

</div>

      <div className="outreachBlock">

        <div className="blockHeader">

          <h3>Email Subject</h3>

          <button
            onClick={() => copy(outreach.email.subject)}
          >
            Copy
          </button>

        </div>

        <div className="blockBody">
          {outreach.email.subject}
        </div>

      </div>

      <div className="outreachBlock">

        <div className="blockHeader">

          <h3>Email Body</h3>

          <button
            onClick={() => copy(outreach.email.body)}
          >
            Copy
          </button>

        </div>

        <div className="blockBody">
          {outreach.email.body}
        </div>

      </div>

      <div className="outreachBlock">

        <div className="blockHeader">

          <h3>LinkedIn Message</h3>

          <button
            onClick={() => copy(outreach.linkedin)}
          >
            Copy
          </button>

        </div>

        <div className="blockBody">
          {outreach.linkedin}
        </div>

      </div>

      <div className="outreachBlock">

        <h3>Why this signal matters</h3>

        <div className="blockBody">
          {outreach.whyItMatters}
        </div>

      </div>

    </div>
  );
}