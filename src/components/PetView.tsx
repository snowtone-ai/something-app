import type { PetState } from '../domain/types';

const STAGE_COLORS: Record<PetState['stage'], { body: string; belly: string }> = {
  egg: { body: '#e7e5e4', belly: '#fafaf9' },
  hatchling: { body: '#86efac', belly: '#dcfce7' },
  kid: { body: '#4ade80', belly: '#bbf7d0' },
  guardian: { body: '#22c55e', belly: '#a7f3d0' },
  dragon: { body: '#10b981', belly: '#99f6e4' },
  elder: { body: '#f59e0b', belly: '#fde68a' }
};

const MOUTHS: Record<PetState['mood'], string> = {
  happy: 'M 42 62 Q 50 70 58 62',
  worried: 'M 42 65 Q 50 61 58 65',
  sick: 'M 42 66 Q 46 62 50 66 Q 54 70 58 66'
};

/** Deterministic SVG rendering of Zenny — stage sets shape/colors, mood sets the face. */
export function PetView({ pet }: { pet: PetState }) {
  const { body, belly } = STAGE_COLORS[pet.stage];
  const showWings = pet.level >= 4;
  const showHorns = pet.level >= 3;
  const showCrown = pet.stage === 'elder';

  if (pet.stage === 'egg') {
    return (
      <svg viewBox="0 0 100 100" className="pet-svg" role="img" aria-label="Zenny the egg">
        <ellipse cx="50" cy="58" rx="26" ry="32" fill={body} stroke="#a8a29e" strokeWidth="2" />
        <path d="M 30 52 L 38 58 L 46 50 L 54 58 L 62 50 L 70 56" stroke="#a8a29e" strokeWidth="2" fill="none" />
        <circle cx="43" cy="44" r="2.5" fill="#57534e" />
        <circle cx="57" cy="44" r="2.5" fill="#57534e" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className={`pet-svg pet-${pet.mood}`}
      role="img"
      aria-label={`Zenny the ${pet.stage}, feeling ${pet.mood}`}
    >
      {showWings && (
        <>
          <path d="M 14 48 Q 4 34 20 30 Q 26 40 28 48 Z" fill={belly} stroke={body} strokeWidth="2" />
          <path d="M 86 48 Q 96 34 80 30 Q 74 40 72 48 Z" fill={belly} stroke={body} strokeWidth="2" />
        </>
      )}
      {/* ears / horns */}
      {showHorns ? (
        <>
          <path d="M 34 26 L 30 12 L 42 20 Z" fill="#fbbf24" />
          <path d="M 66 26 L 70 12 L 58 20 Z" fill="#fbbf24" />
        </>
      ) : (
        <>
          <circle cx="34" cy="24" r="7" fill={body} />
          <circle cx="66" cy="24" r="7" fill={body} />
        </>
      )}
      {showCrown && <path d="M 38 12 L 42 4 L 50 10 L 58 4 L 62 12 Z" fill="#fbbf24" stroke="#d97706" />}
      {/* body */}
      <circle cx="50" cy="52" r="30" fill={body} />
      <ellipse cx="50" cy="60" rx="19" ry="16" fill={belly} />
      {/* coin slot — Zenny is part piggy bank */}
      <rect x="44" y="28" width="12" height="3" rx="1.5" fill="#065f46" opacity="0.5" />
      {/* eyes */}
      {pet.mood === 'sick' ? (
        <>
          <path d="M 38 44 L 44 48 M 44 44 L 38 48" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
          <path d="M 56 44 L 62 48 M 62 44 L 56 48" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="41" cy="46" r="3.5" fill="#1c1917" />
          <circle cx="59" cy="46" r="3.5" fill="#1c1917" />
          <circle cx="42.2" cy="44.8" r="1.2" fill="#fff" />
          <circle cx="60.2" cy="44.8" r="1.2" fill="#fff" />
        </>
      )}
      <path d={MOUTHS[pet.mood]} stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
      {pet.mood === 'happy' && (
        <>
          <circle cx="33" cy="54" r="4" fill="#fca5a5" opacity="0.6" />
          <circle cx="67" cy="54" r="4" fill="#fca5a5" opacity="0.6" />
        </>
      )}
    </svg>
  );
}
