import React from 'react';

export default function Footer() {
  return (
      <footer className="bg-night text-baby-powder py-6 text-center text-sm">
          © {new Date().getFullYear()} I'MMIntoYou. Tous droits réservés.
      </footer>
  );
}
