'use client';
import {useCallback, useEffect, useRef, useState} from 'react';
import {isOrderStage, orderStages, stageLabel, type OrderStage, type StudioOrder} from '@/lib/studio-orders';

export function OrderKanban({orders, busy, onMove, onOpen}: {
  orders: StudioOrder[]; busy: boolean;
  onMove: (id: string, stage: OrderStage) => void;
  onOpen?: (id: string) => void;
}) {
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<OrderStage | null>(null);
  function finish(id: string, target: unknown) {
    if (!busy && isOrderStage(target) && orders.some(o => o.id === id && o.status !== target)) onMove(id, target);
    setDragged(null); setOver(null);
  }
  return <div className="order-kanban" aria-label="Order stages">{orderStages.map(stage => <section
    key={stage} data-order-stage={stage} className={`order-column ${over === stage ? 'order-drop-active' : ''}`}
    aria-label={stageLabel(stage)} onDragOver={event => { if (dragged && !busy) { event.preventDefault(); setOver(stage); } }}
    onDrop={event => { event.preventDefault(); if (dragged) finish(dragged, stage); }}>
    <h2>{stageLabel(stage)} <span>{orders.filter(o => o.status === stage).length}</span></h2>
    {orders.filter(o => o.status === stage).map(order => {
      const isDue = Boolean(order.followUp && new Date(order.followUp.slice(0, 10)).getTime() <= Date.now());
      const refCode = order.reference || (order.id.startsWith('DO') ? order.id : order.id.slice(0, 8));
      return <article key={order.id} className={`order-card ${dragged === order.id ? 'order-dragging' : ''}`}>
        <div className="order-card-top">
          <small className="order-ref-code">{refCode}</small>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <button type="button" className="order-copy-ref" title="Copy reference ID" onClick={(e)=>{e.stopPropagation();void navigator.clipboard?.writeText(order.reference || order.id);}}>📋</button>
            <button type="button" className="order-grip" aria-label={`Drag ${order.client} to another stage`} disabled={busy}
              draggable={!busy} onDragStart={event => { event.dataTransfer.setData('text/plain', order.id); event.dataTransfer.effectAllowed = 'move'; setDragged(order.id); }}
              onDragEnd={() => { setDragged(null); setOver(null); }}
              onPointerDown={event => { if (event.pointerType !== 'mouse' && !busy) { event.currentTarget.setPointerCapture(event.pointerId); setDragged(order.id); } }}
              onPointerMove={event => { if (event.pointerType !== 'mouse' && dragged === order.id) { const target = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-order-stage]')?.getAttribute('data-order-stage'); setOver(isOrderStage(target) ? target : null); } }}
              onPointerUp={event => { if (event.pointerType !== 'mouse' && dragged === order.id) { const target = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-order-stage]')?.getAttribute('data-order-stage'); finish(order.id,target); } }}
              onPointerCancel={() => { setDragged(null); setOver(null); }}>⠿</button>
          </div>
        </div>
        {onOpen ? <button type="button" className="order-open" disabled={busy} onClick={() => onOpen(order.id)}>{order.client}</button> : <h3>{order.client}</h3>}
        <p>{order.title}</p>
        <div className="order-meta-badges">
          <span className="order-source-badge">{order.source === 'manual' ? 'Staff manual' : order.requestKind === 'bespoke' ? 'Bespoke' : 'Piece'}</span>
          {order.followUp && (
            <span className={isDue ? "order-due-urgent" : "order-due-normal"}>
              {isDue ? '⚠️ Due ' : 'Follow-up: '}{order.followUp.slice(0, 10)}
            </span>
          )}
          {Boolean(order.referenceCount) && (
            <span className="order-ref-badge">📷 {order.referenceCount} refs</span>
          )}
        </div>
        {order.source&&<p><small>{order.assigneeName||'Unassigned'}{order.createdAt?' · '+order.createdAt.slice(0,10):''}</small></p>}
        <label className="order-stage-select">Move to<select aria-label={`Move ${order.client} to stage`} value={order.status} disabled={busy}
          onChange={event => finish(order.id,event.target.value)}>{orderStages.map(s => <option key={s} value={s}>{stageLabel(s)}</option>)}</select></label>
      </article>;
    })}
    {!orders.some(o => o.status === stage) && <p className="order-empty">Drop an order here</p>}
  </section>)}</div>;
}

export function StudioOrdersBoard() {
  const [orders, setOrders] = useState<StudioOrder[]>([]);
  const [ready, setReady] = useState(false), [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [message, setMessage] = useState(''), [query, setQuery] = useState('');
  const [client, setClient] = useState(''), [title, setTitle] = useState('');
  const [truncated, setTruncated] = useState(false);
  const load = useCallback((signal?: AbortSignal) => fetch('/api/studio/orders',{cache:'no-store',signal}).then(async response=>{
    const result = await response.json();
    if(signal?.aborted)return;
    if(response.status===401){window.location.assign('/studio/login');return;}
    if(!response.ok)throw new Error(result.error||'Unable to load orders.');
    setOrders(result.orders);setTruncated(result.hasMore);setReady(true);
  }),[]);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal).catch(error => { if (!controller.signal.aborted) setMessage(error.message); });
    return () => controller.abort();
  },[load]);
  async function save(payload: object, success: string) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setMessage('Saving…');
    try {
      const response = await fetch('/api/studio/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result = await response.json();
      if (response.status === 401) { window.location.assign('/studio/login'); return; }
      if (response.status === 409) { await load(); throw new Error(result.error); }
      if (!response.ok) throw new Error(result.error || 'The change was not saved.');
      setOrders(previous => previous.some(o => o.id === result.order.id) ? previous.map(o => o.id === result.order.id ? result.order : o) : [result.order,...previous]);
      setMessage(success);
      return true;
    } catch (error) { setMessage(error instanceof Error ? error.message : 'The change was not saved.'); }
    finally { inFlight.current = false; setBusy(false); }
  }
  async function refresh() { if (inFlight.current) return; inFlight.current=true; setBusy(true); try { await load(); setMessage('Board refreshed.'); } catch { setMessage('Unable to refresh the board. Try again.'); } finally { inFlight.current=false; setBusy(false); } }
  const visible = orders.filter(o => `${o.client} ${o.title} ${o.id}`.toLowerCase().includes(query.toLowerCase()));
  return <><header className="studio-page-heading"><div><p className="eyebrow">ORDERS</p><h1>Work in motion.</h1><p>Drag an order between stages, or choose its next stage on the card.</p></div><button className="studio-button" disabled={busy} onClick={() => void refresh()}>Refresh board</button></header>
    <div className="studio-toolbar"><label>Find an order<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Client, brief or reference"/></label><span>{visible.length} orders</span></div>
    <details className="studio-panel"><summary>Add an order</summary><form className="order-create" onSubmit={async event => {event.preventDefault(); if (await save({action:'create',client,title},'Order saved.')) {setClient('');setTitle('');}}}>
      <label>Client name<input value={client} onChange={event=>setClient(event.target.value)} maxLength={120} required disabled={busy}/></label>
      <label>Order brief<input value={title} onChange={event=>setTitle(event.target.value)} maxLength={240} required disabled={busy}/></label>
      <button type="submit" className="studio-button primary" disabled={busy || !ready}>Save order</button>
    </form></details>
    <p role="status" aria-live="polite">{message || (ready ? 'Order changes are saved to the Studio database.' : 'Loading orders…')}</p>
    {truncated && <p>The latest 1,000 orders are shown.</p>}
    {ready && !orders.length && <p>No orders yet. Add your first order above.</p>}
    {ready && <OrderKanban orders={visible} busy={busy} onMove={(id,status) => { const order=orders.find(o=>o.id===id); if(order) void save({action:'move',id,status,version:order.version},`Moved to ${stageLabel(status)}.`); }}/>}</>;
}
