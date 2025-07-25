import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add meta tags for SEO
const updateMetaTags = () => {
  // Update title
  document.title = 'Linux Playground - Cloud Terminal Access';
  
  // Create and update meta description if it doesn't exist
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', 'Access a cloud-based Linux terminal instantly. Practice Linux commands, develop applications, and experiment in a secure environment.');
  
  // Create and update viewport meta if it doesn't exist
  let metaViewport = document.querySelector('meta[name="viewport"]');
  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    document.head.appendChild(metaViewport);
  }
  metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
  
  // Other important meta tags
  const metaTags = [
    { name: 'theme-color', content: '#121212' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Linux Playground - Cloud Terminal Access' },
    { property: 'og:description', content: 'Access a cloud-based Linux terminal instantly. Practice Linux commands, develop applications, and experiment in a secure environment.' },
    { property: 'og:type', content: 'website' },
  ];
  
  metaTags.forEach(tag => {
    let metaTag = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (tag.property) {
        metaTag.setAttribute('property', tag.property);
      } else {
        metaTag.setAttribute('name', tag.name);
      }
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', tag.content);
  });
};

// Update meta tags
updateMetaTags();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);