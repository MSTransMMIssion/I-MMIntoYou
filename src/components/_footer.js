import React from 'react';

export default function Footer() {
  return (
      <footer className="bg-night text-baby-powder py-6 text-center text-sm relative bottom-0 left-0 w-full">
          © {new Date().getFullYear()} I'MMIntoYou. Tous droits réservés.
      </footer>
  );
}
