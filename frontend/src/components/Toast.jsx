import { useEffect, useState } from 'react';

let push = () => {};
export function toast(msg, type = 'success') { push(msg, type); }

export default function Toast() {
  const [state, setState] = useState({ msg: '', type: '', show: false });

  useEffect(() => {
    push = (msg, type = 'success') => {
      setState({ msg, type, show: true });
      window.clearTimeout(push._t);
      push._t = window.setTimeout(() => setState(s => ({ ...s, show: false })), 3500);
    };
  }, []);

  return (
    <div className={`toast ${state.type === 'error' ? 'error' : ''} ${state.show ? 'show' : ''}`}>
      {state.msg}
    </div>
  );
}
