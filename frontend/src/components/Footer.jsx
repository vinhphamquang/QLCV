import React from 'react';

const Footer = () => {
  return (
    <footer className="shrink-0 bg-[#1e40af] text-white text-center py-2 px-4 text-xs border-t border-blue-900">
      <span className="text-blue-200">
        © {new Date().getFullYear()} Trường THCS Trần Phú – TP. Trà Vinh &nbsp;|&nbsp; Phát triển bởi Thực tập sinh TVU
      </span>
    </footer>
  );
};

export default Footer;
