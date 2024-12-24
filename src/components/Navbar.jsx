// components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex justify-around items-center px-4 sm:px-6 lg:px-8 py-4 bg-gray-800 text-white sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        JAMstack
      </Link>

      {/* Navigation */}
      <nav className="hidden sm:flex space-x-4">
        <Link href="/">Browse Posts</Link>
        {/* Add more navigation links as needed */}
      </nav>
    </header>
  );
};

export default Navbar;
