import React from 'react';

// News-related abstract images
const NEWS_BUBBLES = [
  { id: 1, top: '10%', left: '5%', size: 'w-20 h-20', delay: '0s' },
  { id: 2, top: '30%', left: '20%', size: 'w-16 h-16', delay: '0.2s' },
  { id: 3, top: '70%', left: '10%', size: 'w-24 h-24', delay: '0.4s' },
  { id: 4, top: '15%', right: '10%', size: 'w-28 h-28', delay: '0.6s' },
  { id: 5, top: '50%', right: '5%', size: 'w-20 h-20', delay: '0.8s' },
  { id: 6, top: '80%', right: '15%', size: 'w-16 h-16', delay: '1s' },
];

const NEWS_SNIPPETS = [
  { id: 1, content: 'Breaking News', color: 'bg-red-500', top: '15%', left: '8%', rotate: '-5deg' },
  { id: 2, content: 'Tech', color: 'bg-blue-500', top: '45%', left: '12%', rotate: '3deg' },
  { id: 3, content: 'Finance', color: 'bg-green-500', top: '75%', left: '15%', rotate: '-8deg' },
  { id: 4, content: 'Culture', color: 'bg-purple-500', top: '25%', right: '12%', rotate: '6deg' },
  { id: 5, content: 'Politics', color: 'bg-yellow-500', top: '60%', right: '8%', rotate: '-4deg' },
  { id: 6, content: 'Sports', color: 'bg-orange-500', top: '85%', right: '15%', rotate: '7deg' },
];

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      
      {/* Animated news bubbles */}
      {NEWS_BUBBLES.map(bubble => (
        <div 
          key={bubble.id}
          className={`absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg ${bubble.size}`}
          style={{
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            animationDelay: bubble.delay,
          }}
        />
      ))}
      
      {/* News snippets */}
      {NEWS_SNIPPETS.map(snippet => (
        <div 
          key={snippet.id}
          className={`absolute ${snippet.color} opacity-20 px-4 py-2 rounded-lg text-xs font-bold text-white transform`}
          style={{
            top: snippet.top,
            left: snippet.left,
            right: snippet.right,
            transform: `rotate(${snippet.rotate})`,
          }}
        >
          {snippet.content}
        </div>
      ))}
    </div>
  );
};

export default Background;