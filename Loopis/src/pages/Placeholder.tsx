import React from 'react';

interface PlaceholderProps {
  title: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="glassmorphism p-12 rounded-3xl text-center max-w-lg w-full">
        <h2 className="text-2xl font-bold text-brand-graphite dark:text-brand-off-white mb-4">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Esta tela está em desenvolvimento.
        </p>
      </div>
    </div>
  );
};
