import React from 'react'

/**
 * Placeholder for legacy section routes (cardphoto, cardtext, envelope, date, aroma).
 * The main app uses CardPanel + CardSectionEditor; these routes are kept for backwards compatibility.
 */
const LegacyPagePlaceholder: React.FC = () => (
  <div className="page legacy-placeholder" style={{ padding: '2rem', textAlign: 'center' }}>
    <p>This section is available in the main app view.</p>
  </div>
)

export default LegacyPagePlaceholder
