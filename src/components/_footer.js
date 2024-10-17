import React from 'react';

export default function Footer() {
  return (
      <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="container mx-auto text-center space-y-6">
              {/* Logo et copyright */}
              <div>
                  <img src="/logo.png" alt="I'MMIntoYou Logo"
                       className="mx-auto h-12 w-12 mb-4"/> {/* Logo blanc */}
                  <p className="text-gray-400">&copy; 2024 I'MMIntoYou. Tous droits réservés.</p>
              </div>

              {/* Navigation */}
              <nav className="flex justify-center space-x-6">
                  <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a>
                  <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About</a>
                  <a href="/contact"
                     className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
              </nav>

              {/* Développeurs */}
              <p className="text-gray-500 text-sm">
                  Développé par l'équipe <span className="text-white font-semibold">MMI</span>
              </p>

              {/* Réseaux sociaux */}
              <div className="flex justify-center space-x-6 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                              d="M22.675 0H1.325C.593 0 0 .592 0 1.324v21.352C0 23.407.593 24 1.325 24h21.351C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.675 0zm-4.319 8.476c.006.13.009.262.009.392 0 4.007-3.048 8.634-8.634 8.634-1.717 0-3.314-.503-4.661-1.372a6.12 6.12 0 004.493-1.253c-1.399-.026-2.58-.949-2.987-2.216.195.037.396.056.603.056.292 0 .576-.039.845-.111-1.457-.292-2.554-1.578-2.554-3.119v-.04c.431.24.928.384 1.454.401a3.047 3.047 0 01-.942-4.068 8.644 8.644 0 006.273 3.179c-.134-.578-.202-1.176-.202-1.793 0-2.518 2.046-4.564 4.563-4.564 1.314 0 2.502.554 3.335 1.444a9.064 9.064 0 002.884-1.102 4.515 4.515 0 01-2.002 2.513 9.01 9.01 0 002.596-.715 9.651 9.651 0 01-2.285 2.378z"/>
                      </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                              d="M24 4.557a9.6 9.6 0 01-2.825.775A4.944 4.944 0 0023.337 3.1a9.924 9.924 0 01-3.149 1.197A4.917 4.917 0 0016.616 3c-2.696 0-4.88 2.17-4.88 4.85 0 .379.044.748.127 1.103A13.959 13.959 0 011.671 3.149a4.832 4.832 0 00-.662 2.444c0 1.688.876 3.18 2.21 4.054A4.907 4.907 0 01.968 8.32v.061c0 2.354 1.684 4.317 3.917 4.762a4.94 4.94 0 01-2.211.083 4.921 4.921 0 004.6 3.399A9.868 9.868 0 010 21.545 13.929 13.929 0 007.548 24c9.14 0 14.138-7.523 14.138-14.05 0-.214-.005-.427-.015-.64A9.936 9.936 0 0024 4.557z"/>
                      </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                              d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.317.975.975 1.255 2.242 1.317 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.344 2.633-1.317 3.608-.975.975-2.242 1.255-3.608 1.317-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.344-3.608-1.317-.975-.975-1.255-2.242-1.317-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.344-2.633 1.317-3.608.975-.975 2.242-1.255 3.608-1.317 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.756 0 8.332.013 7.052.073 5.763.134 4.66.445 3.687 1.417 2.715 2.39 2.403 3.493 2.343 4.782 2.282 6.062 2.269 6.486 2.269 12c0 5.514.013 5.938.073 7.218.061 1.289.372 2.392 1.344 3.365.973.973 2.075 1.284 3.365 1.344 1.28.06 1.704.073 7.218.073s5.938-.013 7.218-.073c1.289-.061 2.392-.372 3.365-1.344.973-.973 1.284-2.075 1.344-3.365.06-1.28.073-1.704.073-7.218s-.013-5.938-.073-7.218c-.061-1.289-.372-2.392-1.344-3.365-.973-.973-2.075-1.284-3.365-1.344C15.938.013 15.514 0 12 0z"/>
                          <path
                              d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                      </svg>
                  </a>
              </div>
          </div>
      </footer>

  );
}