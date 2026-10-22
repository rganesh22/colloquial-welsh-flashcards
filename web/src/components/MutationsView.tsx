import {
  MUTATION_ROWS,
  MUTATION_TYPES,
  SOFT_ONLY,
} from '../data/mutations'

export function MutationsView() {
  return (
    <div className="mutations-page">
      <h1 className="page-title">Mutations</h1>
      <p className="page-lead">
        Initial consonant changes — Colloquial Welsh Lessons 3–4
      </p>

      <div className="mutation-legend">
        {MUTATION_TYPES.map((t) => (
          <div key={t.id} className="mutation-legend-item">
            <strong>
              {t.short} · {t.en}
            </strong>
            <span className="cy-label">{t.cy}</span>
            <p>{t.note}</p>
          </div>
        ))}
      </div>

      <div className="mutation-table-wrap">
        <table className="mutation-table">
          <thead>
            <tr>
              <th scope="col">Radical</th>
              <th scope="col">Soft</th>
              <th scope="col">Aspirate</th>
              <th scope="col">Nasal</th>
            </tr>
          </thead>
          <tbody>
            {MUTATION_ROWS.map((row) => (
              <tr key={row.radical}>
                <th scope="row">{row.radical}</th>
                <td className={cellClass(row.soft)}>{row.soft}</td>
                <td className={cellClass(row.aspirate)}>{row.aspirate}</td>
                <td className={cellClass(row.nasal)}>{row.nasal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mutation-key">
        <span>
          <em>—</em> unaffected
        </span>
        <span>
          <em>∅</em> letter disappears
        </span>
      </p>

      <section className="soft-reminder">
        <h2>Soft mutation (quick)</h2>
        <ul className="soft-grid">
          {SOFT_ONLY.map((r) => (
            <li key={r.from}>
              <span className="from">{r.from.toUpperCase()}</span>
              <span className="arrow">→</span>
              <span className="to">{r.to === '∅' ? '(gone)' : r.to}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mutation-examples">
        <h2>Examples</h2>
        <ul>
          {MUTATION_ROWS.filter((r) => r.example).map((r) => (
            <li key={r.radical}>
              <code>{r.radical}-</code> {r.example}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function cellClass(cell: string): string {
  if (cell === '—') return 'mut-none'
  if (cell === '∅') return 'mut-drop'
  return 'mut-change'
}
