'use client';
import { useState } from 'react';
import { LoginForm } from './LoginModal';

export default function Header() {
  const [modal, setModal] = useState(false);

  return (
    <div>
      <div className="bg-neutral-700 h-10 w-full flex justify-between px-10 items-center">
        <div>logo</div>

        <ul className="flex gap-4">
          <li>Home</li>
          <li>Ai games</li>
          <li>Ai tools</li>
          <li>About</li>
        </ul>

        <div>
          <button
            className="bg-white rounded-2xl text-black px-2 py-1"
            onClick={() => setModal(true)}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Modal */}
      {modal && <LoginForm closeModal={() => setModal(false)} />}
    </div>
  );
}
