'use client';

import { use, useEffect, useState } from 'react';

export default function Manage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);

  const [data, setData] = useState<any>();
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/rsvp/${code}`).then((r) =>
      r.json().then((x) => (r.ok ? setData(x) : setError(x.error)))
    );
  }, [code]);

  async function cancel() {
    if (!confirm('Cancel this RSVP?')) return;

    await fetch(`/api/rsvp/${code}`, {
      method: 'DELETE',
    });

    location.reload();
  }

  return (
    <main className="shell section">
      <div className="card">
        {error ? (
          <p className="notice error">{error}</p>
        ) : !data ? (
          <p>Loading…</p>
        ) : (
          <>
            <div className="eyebrow">Your nesting party RSVP</div>

            <h1 className="title" style={{ fontSize: '3.2rem' }}>
              You’re on the <span className="script">crew</span>!
            </h1>

            {data.status === 'cancelled' && (
              <p className="notice error">
                This RSVP has been cancelled.
              </p>
            )}

            <p>
              <strong>{data.name}</strong> · Party of {data.party_size}
            </p>

            <p>
              <strong>Time:</strong> {data.arrival_time}–{data.departure_time}
            </p>

            <p>
              <strong>Tasks:</strong>{' '}
              {data.task_signups?.length
                ? data.task_signups.map((x: any) => (
                    <span className="pill" key={x.task_id}>
                      {x.tasks?.title}
                    </span>
                  ))
                : 'Place me where needed'}
            </p>

            <div
              className="card"
              style={{
                marginTop: '24px',
                background: '#faf8f3',
              }}
            >
              <div className="eyebrow">Party location</div>

              <h2 style={{ marginBottom: '12px' }}>
                See you at the nest
              </h2>

              <p style={{ lineHeight: 1.6 }}>
                <strong>
                  1409 Botham Jean Blvd
                  <br />
                  Apt. 407
                  <br />
                  Dallas, TX 75126
                </strong>
              </p>

              <div className="actions">
                <a
                  className="btn"
                  href="https://www.google.com/maps/search/?api=1&query=1409+Botham+Jean+Blvd+Dallas+TX+75126"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <p className="notice" style={{ marginTop: '24px' }}>
              Save this private page. This is your personal RSVP link for
              viewing your details or cancelling your RSVP later.
            </p>

            {data.status !== 'cancelled' && (
              <button className="btn danger" onClick={cancel}>
                Cancel RSVP
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}