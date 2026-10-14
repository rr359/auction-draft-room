import React, { useEffect, useRef } from 'react';
import { useLocalState } from '@instinct/files';
import './style.css';
import './draft.css';
import { MARKUP } from './markup';
// @ts-ignore - plain JS module
import { initDraftRoom } from './draft';

export function App() {
    const ref = useRef<HTMLDivElement>(null);
    const mounted = useRef(false);
    const [stored, setStored, saved] = useLocalState<string | null>('draft-room.v1', null);

    useEffect(() => {
        const el = ref.current;
        if (el && !mounted.current) {
            mounted.current = true;
            el.innerHTML = MARKUP;
            (window as any).__drs = { save: (j: string) => { try { setStored(j); (window as any).__drsLast = j; } catch (e) {} } };
            initDraftRoom();
        }
    }, []);

    useEffect(() => {
        if (saved.ready && typeof stored === 'string' && stored && (window as any).__draftLoad) {
            (window as any).__draftLoad(stored);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saved.ready]);

    useEffect(() => {
        let t = document.getElementById('__drsToast');
        if (!t) {
            t = document.createElement('div');
            t.id = '__drsToast';
            t.style.cssText = 'position:fixed;bottom:64px;left:8px;right:8px;z-index:9999;font:12px/1.4 system-ui;color:#ffd166;text-align:center;pointer-events:none';
            document.body.appendChild(t);
        }
        t.textContent = saved.ready ? '' : (saved.message || '');
    }, [saved.ready, saved.message]);

    return <div ref={ref} className="dapp" />;
}
