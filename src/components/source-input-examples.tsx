const sourceExamples = [
  {
    label: "Short note",
    example:
      "I keep noticing that AI writing gets cleaner but less honest. I want to write about why rough thinking matters."
  },
  {
    label: "URL",
    example: "https://example.com/articles/why-source-context-matters"
  },
  {
    label: "YouTube",
    example: "https://youtu.be/example123"
  },
  {
    label: "GitHub",
    example: "https://github.com/kwmin122/auto-writer-skills"
  },
  {
    label: "Paper",
    example: "https://arxiv.org/abs/2401.12345"
  }
] as const;

export function SourceInputExamples() {
  return (
    <section className="panel">
      <div className="panel-header">
        <p className="eyebrow">Supported inputs</p>
        <h2>Paste mixed materials without cleaning them up first.</h2>
      </div>

      <div className="example-grid">
        {sourceExamples.map((item) => (
          <article className="example-card" key={item.label}>
            <p className="example-label">{item.label}</p>
            <code>{item.example}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
