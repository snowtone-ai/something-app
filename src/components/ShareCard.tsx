import { useEffect, useRef, useState } from 'react';
import { formatCents } from '../domain/money';
import type { PetState } from '../domain/types';

interface Props {
  pet: PetState;
  slainCount: number;
  currency: string;
  onClose: () => void;
}

const SIZE = 1080;

function draw(canvas: HTMLCanvasElement, pet: PetState, slainCount: number, currency: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const g = ctx.createLinearGradient(0, 0, 0, SIZE);
  g.addColorStop(0, '#052e16');
  g.addColorStop(1, '#14532d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#bbf7d0';
  ctx.font = '600 44px system-ui, sans-serif';
  ctx.fillText('MY SUBSCRIPTIONS FEARED ME', SIZE / 2, 150);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 130px system-ui, sans-serif';
  ctx.fillText(`${formatCents(pet.rescuedYearlyCents, currency)}/yr`, SIZE / 2, 330);

  ctx.fillStyle = '#86efac';
  ctx.font = '500 52px system-ui, sans-serif';
  ctx.fillText(`rescued by slaying ${slainCount} subscription${slainCount === 1 ? '' : 's'}`, SIZE / 2, 420);

  // simple Zenny mark
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(SIZE / 2, 640, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#dcfce7';
  ctx.beginPath();
  ctx.ellipse(SIZE / 2, 675, 82, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(SIZE / 2 - 40, 615, 14, 0, Math.PI * 2);
  ctx.arc(SIZE / 2 + 40, 615, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 35, 680);
  ctx.quadraticCurveTo(SIZE / 2, 715, SIZE / 2 + 35, 680);
  ctx.stroke();

  ctx.fillStyle = '#bbf7d0';
  ctx.font = '600 46px system-ui, sans-serif';
  ctx.fillText(`Zenny the ${pet.stage} — Lv. ${pet.level}`, SIZE / 2, 870);

  ctx.fillStyle = '#4ade80';
  ctx.font = '500 38px system-ui, sans-serif';
  ctx.fillText('Zenny — the anti-subscription app', SIZE / 2, 990);
}

export function ShareCard({ pet, slainCount, currency, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      draw(canvas, pet, slainCount, currency);
      setDataUrl(canvas.toDataURL('image/png'));
    } catch {
      // canvas unsupported (e.g. jsdom) — download link simply stays hidden
    }
  }, [pet, slainCount, currency]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label="Share your victory" onClick={(e) => e.stopPropagation()}>
        <h2>Share your victory</h2>
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="share-canvas" />
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Close
          </button>
          {dataUrl && (
            <a className="btn primary" href={dataUrl} download="zenny-victory.png">
              Download image
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
